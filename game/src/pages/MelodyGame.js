import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://127.0.0.1:5000"; // Flask 伺服器地址

const MelodyGame = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [audioIndex, setAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // **音符對應音檔**
  const mapping = {
    "quarter_note|C3": "quarter_note_C3_Do.wav",
    "quarter_note|D3": "quarter_note_C3_Re.wav",
    "quarter_note|E3": "quarter_note_C3_Mi.wav",
    "quarter_note|F3": "quarter_note_C3_Fa.wav",
    "quarter_note|G3": "quarter_note_C3_Sol.wav",
    "quarter_note|A3": "quarter_note_C3_La.wav",
    "quarter_note|B3": "quarter_note_C3_Si.wav",
    "quarter_note|C4": "1_C4.wav",
    "quarter_note|D4": "1_D4.wav",
    "quarter_note|E4": "1_E4.wav",
    "quarter_note|F4": "1_F4.wav",
    "quarter_note|G4": "1_G4.wav",
    "quarter_note|A4": "1_A4.wav",
    "quarter_note|B4": "1_B4.wav",
    "half_note|C4": "2_C4.wav",
    "half_note|D4": "2_D4.wav",
    "half_note|E4": "2_E4.wav",
    "half_note|F4": "2_F4.wav",
    "half_note|G4": "2_G4.wav",
    "half_note|A4": "2_A4.wav",
    "half_note|B4": "2_B4.wav",
    "whole_note|C4": "4_C4.wav",
    "whole_note|D4": "4_D4.wav",
    "whole_note|E4": "4_E4.wav",
    "whole_note|F4": "4_F4.wav",
    "whole_note|G4": "4_G4.wav",
    "whole_note|A4": "4_A4.wav",
    "whole_note|B4": "4_B4.wav",
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("無法存取攝影機：", error);
      });
  }, []);

  const handleRecord = async () => {
    setLoading(true);
    try {
      if (!videoRef.current || !canvasRef.current) {
        console.error("未找到攝影機畫面或 Canvas");
        setLoading(false);
        return;
      }

      // 確保 Canvas 大小與 Video 一致
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 400; // 預設寬度
      canvas.height = video.videoHeight || 300; // 預設高度

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // **確保影像格式正確 (使用更標準的 JPEG 壓縮)**
      const imageData = canvas.toDataURL("image/jpeg", 0.9); // 0.9 = 高品質壓縮

      // **發送 API 請求**
      const res = await fetch(`${API_BASE_URL}/api/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ image: imageData }), // 確保格式正確
      });

      const data = await res.json();
      if (data.status === "ok") {
        console.log("🎵 辨識成功！音符:", data.notes);
      } else {
        console.error("⚠ 辨識失敗:", data.message);
      }
    } catch (error) {
      console.error("❌ 辨識時發生錯誤: ", error);
    }
    setLoading(false);
  };

  // **🔹 播放辨識到的音符**
  const handlePlay = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/play`);
      const data = await res.json();

      if (data.status === "ok" && data.notes.length > 0) {
        console.log("🎵 開始播放音符:", data.notes);

        // **轉換音符為音檔名稱**
        const audioFiles = data.notes
          .map(([noteType, pitch]) => {
            const key = `${noteType}|${pitch}`;
            return mapping[key]
              ? `${API_BASE_URL}/static/sounds/${mapping[key]}`
              : null;
          })
          .filter(Boolean); // 過濾掉 `null`

        if (audioFiles.length === 0) {
          console.error("⚠ 沒有對應的音檔可播放");
          return;
        }

        let audioIndex = 0;
        let audioElement = new Audio();

        const playNextAudio = () => {
          if (audioIndex < audioFiles.length) {
            audioElement.src = audioFiles[audioIndex];

            audioElement
              .play()
              .then(() => {
                console.log(`▶ 播放中: ${audioFiles[audioIndex]}`);
              })
              .catch((error) => {
                console.error("⚠ 播放失敗:", error);
              });

            audioElement.onended = () => {
              audioIndex++;
              playNextAudio(); // 播放下一個音檔
            };
          } else {
            console.log("🎶 所有音符播放完畢！");
          }
        };

        // 確保有用戶互動後播放
        document.body.addEventListener(
          "click",
          () => {
            playNextAudio();
          },
          { once: true }
        );
      } else {
        console.error("⚠ 沒有音符可播放");
      }
    } catch (error) {
      console.error("❌ 播放音符時發生錯誤:", error);
    }
  };

  // **🔹 重置辨識結果**
  const handleReset = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reset`, { method: "POST" });
      const data = await res.json();
      if (data.status === "ok") {
        console.log("重置成功");
      } else {
        console.error("重置失敗");
      }
    } catch (error) {
      console.error("重置時發生錯誤: ", error);
    }
  };

  // 音檔列表（按順序播放）
  const audioFiles = [
    "2_G4.wav",
    "1_E4.wav",
    "1_F4.wav",
    "2_G4.wav",
    "1_E4.wav",
    "1_F4.wav",
    "1_G4.wav",
    "1_G4.wav",
    "1_A4.wav",
    "1_A4.wav",
    "4_G4.wav",
  ].map((file) => `http://127.0.0.1:5000/static/sounds/${file}`);

  // 音符對應的 class
  const noteClasses = [
    "note_2_G4",
    "note_1_E4",
    "note_1_F4",
    "note_2_G4",
    "note_1_E4",
    "note_1_F4",
    "note_1_G4",
    "note_1_G4",
    "note_1_A4",
    "note_1_A4",
    "note_4_G4",
  ];

  // 播放音檔並更新當前播放的 note
  const playNextAudio = () => {
    if (audioIndex < audioFiles.length) {
      setActiveNoteIndex(audioIndex); // 設定當前播放音符的 index
      const audio = new Audio(audioFiles[audioIndex]);
      audio.play();
      audio.onended = () => {
        setAudioIndex((prev) => prev + 1);
        setActiveNoteIndex(null); // 恢復透明度
      };
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      playNextAudio();
    }
  }, [audioIndex, isPlaying]);

  return (
    <div className="melody-game-container container">
      <div className="video-container">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/videos/melody_game_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div
        className="BackBtn BackBtn_black"
        onClick={() => navigate("/")}
      ></div>

      {/* 測試用按鈕（跳轉到 MelodyGameResult） */}
      <button className="test-btn" onClick={() => navigate("/melody/result")}>
        到結果頁（測試用）
      </button>

      {/* Menu Button */}
      <div className="menu-container">
        <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
          <img src="/images/melody/btn_menu.png" alt="Menu" />
        </button>

        {/* Menu Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="menu-panel"
            >
              {/* 播放按鈕
              <button className="menu-item" onClick={() => setIsPlaying(true)}>
                <img src="/images/melody/btn_menu_play.png" alt="Play" />
              </button>

              識別+記憶
              <button className="menu-item" onClick={() => setIsPlaying(false)}>
                <img src="/images/melody/btn_menu_record.png" alt="Record" />
              </button>

              重置
              <button
                className="menu-item"
                onClick={() => {
                  setAudioIndex(0);
                  setIsPlaying(true);
                }}
              >
                <img src="/images/melody/btn_menu_restart.png" alt="Reset" />
              </button> */}
              {/* 播放按鈕 */}
              <button
                className="menu-item"
                onClick={handlePlay}
                disabled={loading}
              >
                <img src="/images/melody/btn_menu_play.png" alt="Play" />
              </button>

              {/* 辨識+記錄 */}
              <button
                className="menu-item"
                onClick={handleRecord}
                disabled={loading}
              >
                <img src="/images/melody/btn_menu_record.png" alt="Record" />
              </button>

              {/* 重置 */}
              <button className="menu-item" onClick={handleReset}>
                <img src="/images/melody/btn_menu_restart.png" alt="Reset" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        className="arrow left left_black"
        onClick={() => navigate("/melody/tutorial")}
      ></button>

      {/* Notes UI */}
      <div className="notes">
        {noteClasses.map((noteClass, index) => (
          <div
            key={index}
            className={`note ${noteClass} ${
              activeNoteIndex === index ? "active" : ""
            }`}
          ></div>
        ))}
      </div>

      {/* 攝影機畫面（暫時顯示） */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="camera-video"
      ></video>

      {/* 隱藏的 Canvas（用於擷取影像） */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default MelodyGame;
