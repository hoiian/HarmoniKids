import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MelodyMenu from "./MelodyMenu"; // 引入 MelodyMenu

const API_BASE_URL = "https://directly-funny-cheetah.ngrok-free.app"; // Flask 伺服器地址
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MelodyGame = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [audioIndex, setAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState(null);
  const [hiddenNotes, setHiddenNotes] = useState([]); // 🔹 狀態：要隱藏的音符
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showLog, setShowLog] = useState(false); // 控制 log 顯示
  const [capturedNotes, setCapturedNotes] = useState([]);

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

    "half_note|C3": "half_note_C3_Do.wav",
    "half_note|D3": "half_note_C3_Re.wav",
    "half_note|E3": "half_note_C3_Mi.wav",
    "half_note|F3": "half_note_C3_Fa.wav",
    "half_note|G3": "half_note_C3_Sol.wav",
    "half_note|A3": "half_note_C3_La.wav",
    "half_note|B3": "half_note_C3_Si.wav",
    "half_note|C4": "2_C4.wav",
    "half_note|D4": "2_D4.wav",
    "half_note|E4": "2_E4.wav",
    "half_note|F4": "2_F4.wav",
    "half_note|G4": "2_G4.wav",
    "half_note|A4": "2_A4.wav",
    "half_note|B4": "2_B4.wav",

    "whole_note|C3": "whole_note_C3_Do.wav",
    "whole_note|D3": "whole_note_C3_Re.wav",
    "whole_note|E3": "whole_note_C3_Mi.wav",
    "whole_note|F3": "whole_note_C3_Fa.wav",
    "whole_note|G3": "whole_note_C3_Sol.wav",
    "whole_note|A3": "whole_note_C3_La.wav",
    "whole_note|B3": "whole_note_C3_Si.wav",
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
        logError("無法存取攝影機：", error);
      });
  }, []);

  const handleRecord = async () => {
    setLoading(true);
    try {
      if (!videoRef.current || !canvasRef.current) {
        logError("未找到攝影機畫面或 Canvas");
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
        logError("🎵 辨識成功！音符:", data.notes);
        setCapturedNotes((prev) => [...prev, ...data.notes]); // 🔹 累加音符
      } else {
        logError("⚠ 辨識失敗:", data.message);
      }
    } catch (error) {
      logError("辨識時發生錯誤", error);
    }
    setLoading(false);
  };

  // **🔹 播放辨識到的音符**
  const handlePlay = async () => {
    try {
      // setAudioIndex(0); // ✅ 一開始就重設 index
      // const res = await fetch(`${API_BASE_URL}/api/play`);
      // const data = await res.json();

      // if (data.status === "ok" && data.notes.length > 0) {
      //   logError("🎵 開始播放音符:", data.notes);
      if (capturedNotes.length > 0) {
        logError("🎵 開始播放音符:", capturedNotes);
        const data = { notes: capturedNotes };

        // **音符類型對應的數字**
        const noteClassMapping = {
          whole_note: "4",
          half_note: "2",
          quarter_note: "1",
        };

        // **轉換 API 回傳的音符為 noteClasses 格式**
        const matchedNotes = data.notes.map(([noteType, pitch]) => {
          const noteNumber = noteClassMapping[noteType] || "1";
          return `note_${noteNumber}_${pitch}`;
        });

        logError("🔹 需要匹配的音符:", matchedNotes);

        // **音符對應音檔**
        const audioFiles = data.notes
          .map(([noteType, pitch]) => {
            const key = `${noteType}|${pitch}`;
            return mapping[key]
              ? // ? `${API_BASE_URL}/static/sounds/${mapping[key]}`
                `/sounds/${mapping[key]}`
              : null;
          })
          .filter(Boolean);

        if (audioFiles.length === 0) {
          logError("⚠ 沒有對應的音檔可播放");
          return;
        }
        let currentPlayIndex = 0;
        setAudioIndex(0); // ✅ Reset index for tracking
        // let currentPlayIndex = audioIndex; // **追蹤當前播放音符的索引**
        logError(`🔄 從索引 ${currentPlayIndex} 開始播放`);

        const playNextAudio = () => {
          if (currentPlayIndex < audioIndex + audioFiles.length) {
            const audioElement = new Audio(
              audioFiles[currentPlayIndex - audioIndex]
            );

            audioElement
              .play()
              .then(() => {
                logError(
                  `▶ 播放中: ${audioFiles[currentPlayIndex - audioIndex]}`
                );

                // **確保 `matchedNotes` 與 `noteClasses` 匹配後才隱藏**
                if (
                  currentPlayIndex < noteClasses.length &&
                  matchedNotes[currentPlayIndex - audioIndex] ===
                    noteClasses[currentPlayIndex]
                ) {
                  setHiddenNotes((prev) => [
                    ...prev,
                    `${noteClasses[currentPlayIndex]}_${currentPlayIndex}`,
                  ]);
                  logError(
                    `✅ 隱藏: ${noteClasses[currentPlayIndex]} - 第 ${
                      currentPlayIndex + 1
                    } 個`
                  );
                } else {
                  console.warn(
                    `⚠ 音符不匹配: ${
                      matchedNotes[currentPlayIndex - audioIndex]
                    } vs ${noteClasses[currentPlayIndex]}`
                  );
                }
              })
              .catch((error) => {
                logError("⚠ 播放失敗:", error);
              });

            audioElement.onended = () => {
              currentPlayIndex++;
              setAudioIndex((prev) => {
                const newIndex = prev + 1;

                // **🔹 當 audioIndex 達到 10，等待 2 秒後跳轉到結果頁面**
                if (newIndex === 10) {
                  logError("🎯 播放完成，2 秒後跳轉到結果頁面");
                  setTimeout(() => {
                    navigate("/melody/result");
                  }, 2000); // **延遲 2 秒**
                }

                return newIndex;
              });
              playNextAudio();
            };
          } else {
            logError("🎶 所有音符播放完畢！");
          }
        };

        // **開始播放**
        playNextAudio();
      } else {
        logError("⚠ 沒有音符可播放");
      }
    } catch (error) {
      logError("❌ 播放音符時發生錯誤:", error);
    }
  };

  // **🔹 重置辨識結果**
  const handleReset = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reset`, { method: "POST" });
      const data = await res.json();
      if (data.status === "ok") {
        logError("重置成功");
        setCapturedNotes([]); // ✅ 清空紀錄
      } else {
        logError("重置失敗");
      }
    } catch (error) {
      logError("辨識時發生錯誤", error);
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

  // function logError(message, error = null) {
  //   const logDiv = document.getElementById("log");
  //   const time = new Date().toLocaleTimeString();
  //   logDiv.innerHTML += `<div>[${time}]  ${message} ${
  //     error ? `<pre>${error}</pre>` : ""
  //   }</div>`;
  // }
  function logError(message, error) {
    const logDiv = document.getElementById("log");
    if (!logDiv) return; // ✅ 防止 null 錯誤
    const time = new Date().toLocaleTimeString();

    // 若 error 是物件就印出 stack 或 message
    const errorMsg =
      error instanceof Error
        ? `<pre>${error.stack || error.message}</pre>`
        : error
        ? `<pre>${error}</pre>`
        : "";

    logDiv.innerHTML += `<div>[${time}] ${message} ${errorMsg}</div>`;
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  return (
    <div className="melody-game-container container">
      <div className="melody-cover"></div>
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
      {/* <button className="test-btn" onClick={() => navigate("/melody/result")}>
        到結果頁（測試用）
      </button> */}

      {/* Menu */}
      <MelodyMenu
        isOpen={isOpen}
        handlePlay={handlePlay}
        handleRecord={handleRecord}
        handleReset={handleReset}
        loading={loading}
        showCamera={showCamera}
        setShowCamera={setShowCamera}
        onlyShow="camera"
      />

      <button
        className="arrow left"
        onClick={() => navigate("/melody/tutorial")}
      ></button>
      <button
        className="arrow right"
        onClick={() => navigate("/melody/story5")}
      ></button>

      {/* Notes UI */}
      <div className="notes">
        {noteClasses.map((noteClass, index) => (
          <div
            key={index}
            className={`note ${noteClass} ${
              hiddenNotes.includes(`${noteClass}_${index}`) ? "" : "hidden"
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
        style={{ opacity: showCamera ? 1 : 0 }}
      ></video>

      {/* 隱藏的 Canvas（用於擷取影像） */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {/* 切換按鈕 */}
      <button
        className="toggleLogbtn"
        onClick={() => setShowLog((prev) => !prev)}
      >
        {/* {showLog ? "隱藏 Log" : "顯示 Log"} */}
      </button>

      <div id="log" style={{ display: showLog ? "block" : "none" }}>
        Log Content
      </div>
    </div>
  );
};

export default MelodyGame;
