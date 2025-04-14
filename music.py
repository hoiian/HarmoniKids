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
# CORS(app)  # 允許所有請求
# CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})
CORS(app, resources={r"/api/*": {"origins": "*"}})


last_recognized_notes = []

# 音符類型＋音高對應到mp3(或wav)檔名的字典 (可自行擴充/修改)
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
    # 若有更多音符和音高組合，請在此加入對應檔名
}
def recognize_notes(img_path):
    model = YOLO("best.pt")
    results = model.predict(source=img_path, conf=0.5)

    recognized_notes = []
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0].item())
            label = model.names[class_id]

            # 直接從 YOLO label 拆出音符與音高（例如 "quarter_note_C4"）
            if "_" in label:
                parts = label.split("_")
                if len(parts) >= 2:
                    note_type = "_".join(parts[:-1])  # 支援 quarter_note 類
                    pitch = parts[-1]
                    recognized_notes.append((note_type, pitch))

    return recognized_notes


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/capture', methods=['POST'])
def capture():
    global last_recognized_notes
    data = request.form.get('image')
    if not data:
        return jsonify({"status": "error", "message": "No image data"}), 400

    # decode base64 to image
    header, encoded = data.split(',', 1)
    img_data = base64.b64decode(encoded)
    img_np = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

    # **水平翻轉影像 (左右相反)**
    img = cv2.flip(img, 1)

    save_path = 'capture.jpg'
    cv2.imwrite(save_path, img)

    # 辨識音符
    last_recognized_notes = recognize_notes(save_path)

    return jsonify({"status": "ok", "notes": last_recognized_notes})

@app.route('/api/play', methods=['GET'])
def play():
    global last_recognized_notes
    return jsonify({"status": "ok", "notes": last_recognized_notes})

@app.route('/api/reset', methods=['POST'])
def reset():
    global last_recognized_notes
    last_recognized_notes = []  # 清空紀錄的音符
    return jsonify({"status": "ok", "message": "已重置所有音符"})

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host="0.0.0.0", port=5000)