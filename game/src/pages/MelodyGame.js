import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MelodyGame = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [audioIndex, setAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState(null);

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
              {/* 播放按鈕 */}
              <button className="menu-item" onClick={() => setIsPlaying(true)}>
                <img src="/images/melody/btn_menu_play.png" alt="Play" />
              </button>

              {/* 停止播放 */}
              <button className="menu-item" onClick={() => setIsPlaying(false)}>
                <img src="/images/melody/btn_menu_record.png" alt="Stop" />
              </button>

              {/* 重新播放 */}
              <button
                className="menu-item"
                onClick={() => {
                  setAudioIndex(0);
                  setIsPlaying(true);
                }}
              >
                <img src="/images/melody/btn_menu_restart.png" alt="Restart" />
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
    </div>
  );
};

export default MelodyGame;
