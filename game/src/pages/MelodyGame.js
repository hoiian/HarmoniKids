import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MelodyGame = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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

      <div className="menu-container">
        {/* Menu Button (82x82) */}
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
              <button className="menu-item">
                <img src="/images/melody/btn_menu_play.png" alt="Play" />
              </button>
              <button className="menu-item">
                <img src="/images/melody/btn_menu_record.png" alt="Record" />
              </button>
              <button className="menu-item">
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
    </div>
  );
};

export default MelodyGame;
