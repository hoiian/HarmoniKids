
from flask import Flask, request, jsonify, render_template
import os
import cv2
import base64
import numpy as np
import math
from sklearn.cluster import KMeans
from ultralytics import YOLO
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

last_recognized_notes = []

note_to_sound = {
    ('quarter_note', 'C3'): 'quarter_note_C3_Do.wav',
    ('quarter_note', 'D3'): 'quarter_note_C3_Re.wav',
    ('quarter_note', 'E3'): 'quarter_note_C3_Mi.wav',
    ('quarter_note', 'F3'): 'quarter_note_C3_Fa.wav',
    ('quarter_note', 'G3'): 'quarter_note_C3_Sol.wav',
    ('quarter_note', 'A3'): 'quarter_note_C3_La.wav',
    ('quarter_note', 'B3'): 'quarter_note_C3_Si.wav',
    ('quarter_note', 'C4'): '1_C4.wav',
    ('quarter_note', 'D4'): '1_D4.wav',
    ('quarter_note', 'E4'): '1_E4.wav',
    ('quarter_note', 'F4'): '1_F4.wav',
    ('quarter_note', 'G4'): '1_G4.wav',
    ('quarter_note', 'A4'): '1_A4.wav',
    ('quarter_note', 'B4'): '1_B4.wav',
    ('half_note', 'C3'): 'half_note_C3_Do.wav',
    ('half_note', 'D3'): 'half_note_C3_Re.wav',
    ('half_note', 'E3'): 'half_note_C3_Mi.wav',
    ('half_note', 'F3'): 'half_note_C3_Fa.wav',
    ('half_note', 'G3'): 'half_note_C3_Sol.wav',
    ('half_note', 'A3'): 'half_note_C3_La.wav',
    ('half_note', 'B3'): 'half_note_C3_Si.wav',
    ('half_note', 'C4'): '2_C4.wav',
    ('half_note', 'D4'): '2_D4.wav',
    ('half_note', 'E4'): '2_E4.wav',
    ('half_note', 'F4'): '2_F4.wav',
    ('half_note', 'G4'): '2_G4.wav',
    ('half_note', 'A4'): '2_A4.wav',
    ('half_note', 'B4'): '2_B4.wav',
    ('whole_note', 'C3'): 'whole_note_C3_Do.wav',
    ('whole_note', 'D3'): 'whole_note_C3_Re.wav',
    ('whole_note', 'E3'): 'whole_note_C3_Mi.wav',
    ('whole_note', 'F3'): 'whole_note_C3_Fa.wav',
    ('whole_note', 'G3'): 'whole_note_C3_Sol.wav',
    ('whole_note', 'A3'): 'whole_note_C3_La.wav',
    ('whole_note', 'B3'): 'whole_note_C3_Si.wav',
    ('whole_note', 'C4'): '4_C4.wav',
    ('whole_note', 'D4'): '4_D4.wav',
    ('whole_note', 'E4'): '4_E4.wav',
    ('whole_note', 'F4'): '4_F4.wav',
    ('whole_note', 'G4'): '4_G4.wav',
    ('whole_note', 'A4'): '4_A4.wav',
    ('whole_note', 'B4'): '4_B4.wav'
}

def recognize_notes(img_path):
    model = YOLO("best.pt")
    results = model.predict(source=img_path, conf=0.5)

    img = cv2.imread(img_path)
    height, width = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
    edges = cv2.Canny(binary, 50, 150, apertureSize=3)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, 100, minLineLength=50, maxLineGap=20)
    if lines is None:
        return []

    valid_lines = []
    for l in lines:
        x1, y1, x2, y2 = l[0]
        angle = math.degrees(math.atan2(y2 - y1, x2 - x1))
        if abs(angle) < 20 or abs(angle - 180) < 20:
            y_center = (y1 + y2) / 2.0
            valid_lines.append(y_center)
    if len(valid_lines) < 5:
        return []

    kmeans = KMeans(n_clusters=5, random_state=0, n_init='auto').fit(np.array(valid_lines).reshape(-1, 1))
    centers = sorted(kmeans.cluster_centers_.flatten())
    avg_spacing = np.mean([centers[i+1] - centers[i] for i in range(4)])
    y_reference = centers[-1] + avg_spacing

    note_map = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5"]

    def get_pitch(y):
        steps = round((y_reference - y) / (avg_spacing / 2))
        return note_map[steps] if 0 <= steps < len(note_map) else "Unknown"

    recognized_notes = []
    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            cls_id = int(box.cls[0])
            label = model.names[cls_id]
            y_mid = (y1 + y2) / 2
            pitch = get_pitch(y_mid)
            recognized_notes.append((label, pitch, x1.item()))

    recognized_notes.sort(key=lambda x: x[2])
    return [(label, pitch) for label, pitch, _ in recognized_notes]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/capture", methods=["POST"])
def capture():
    global last_recognized_notes
    data = request.form.get("image")
    if not data:
        return jsonify({"status": "error", "message": "No image data"}), 400
    header, encoded = data.split(",", 1)
    img_data = base64.b64decode(encoded)
    img_np = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
    img = cv2.flip(img, 1)
    cv2.imwrite("capture.jpg", img)
    last_recognized_notes = recognize_notes("capture.jpg")
    return jsonify({"status": "ok", "notes": last_recognized_notes})

@app.route("/api/play", methods=["GET"])
def play():
    global last_recognized_notes
    return jsonify({"status": "ok", "notes": last_recognized_notes})

@app.route("/api/reset", methods=["POST"])
def reset():
    global last_recognized_notes
    last_recognized_notes = []
    return jsonify({"status": "ok", "message": "已重置所有音符"})

# if __name__ == "__main__":
    # app.run(host="0.0.0.0", port=5000)
if __name__ == '__main__':
    import sys

    port = 5000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except:
            pass

    app.run(host="0.0.0.0", port=port)