import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
              disabled={loading}
            >
              <img src="/images/melody/btn_menu_play.png" alt="Play" />
            </button>

            <button className="menu-item">
              <img src="/images/melody/btn_menu_pause.png" alt="Pause" />
            </button>

            <button
              className="menu-item"
              onClick={handleRecord}
              disabled={loading}
            >
              <img src="/images/melody/btn_menu_record.png" alt="Record" />
            </button>

            <button className="menu-item" onClick={handleReset}>
              <img src="/images/melody/btn_menu_restart.png" alt="Reset" />
            </button>

            {/* 控制文本顯示的按鈕 */}
            {/* <button
              className="menu-item"
              onClick={() => setShowText(!showText)}
            >
              <img src="/images/melody/btn_menu_story.png" alt="Story" />
            </button>

            <button
              className="menu-item"
              onClick={() => setShowCamera((prev) => !prev)}
            >
              <img src="/images/melody/btn_menu_camera.png" alt="Camera" />
            </button> */}
            {onlyShow === "camera" && (
              <button
                className="menu-item"
                onClick={() => setShowCamera((prev) => !prev)}
              >
                <img src="/images/melody/btn_menu_camera.png" alt="Camera" />
              </button>
            )}

            {onlyShow === "story" && (
              <button
                className="menu-item"
                onClick={() => setShowText(!showText)}
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
