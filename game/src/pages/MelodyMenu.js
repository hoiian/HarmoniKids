import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const playClickSound = () => {
  const audio = new Audio("/audio/click.mov");
  audio.play();
};

const MelodyMenu = ({
  handlePlay,
  handleRecord,
  handleReset,
  loading,
  showText,
  setShowText,
  showCamera,
  setShowCamera,
  onlyShow,
  playStoryAudio,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="menu-container">
      {/* Menu Button */}
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
            <button
              className="menu-item"
              onClick={handlePlay}
              onMouseDown={playClickSound}
              disabled={loading}
            >
              <img src="/images/melody/btn_menu_play.png" alt="Play" />
            </button>

            <button className="menu-item" onMouseDown={playClickSound}>
              <img src="/images/melody/btn_menu_pause.png" alt="Pause" />
            </button>

            <button
              className="menu-item"
              onClick={handleRecord}
              onMouseDown={playClickSound}
              disabled={loading}
            >
              <img src="/images/melody/btn_menu_record.png" alt="Record" />
            </button>

            <button
              className="menu-item"
              onClick={handleReset}
              onMouseDown={playClickSound}
            >
              <img src="/images/melody/btn_menu_restart.png" alt="Reset" />
            </button>

            {onlyShow === "camera" && (
              <button
                className="menu-item"
                onClick={() => setShowCamera((prev) => !prev)}
                onMouseDown={playClickSound}
              >
                <img src="/images/melody/btn_menu_camera.png" alt="Camera" />
              </button>
            )}

            {onlyShow === "story" && (
              <button
                className="menu-item"
                onClick={() => {
                  setShowText(!showText);
                  if (!showText) {
                    playStoryAudio?.(); // ✅ 只在打開時播放
                  }
                }}
                onMouseDown={playClickSound}
              >
                <img src="/images/melody/btn_menu_story.png" alt="Story" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MelodyMenu;
