import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MelodyMenu = ({ handlePlay, handleRecord, handleReset, loading }) => {
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MelodyMenu;
