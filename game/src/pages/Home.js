import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useDragControls } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const dragControls = useDragControls();

  const images = [
    "/images/home/thumbnail1_rhythm.png",
    "/images/home/thumbnail2_pitch.png",
    "/images/home/thumbnail3_melody.png", // Melody
    "/images/home/thumbnail4_lock.png",
  ];

  const [positions, setPositions] = useState([
    { x: -33, y: 128, zIndex: 4 },
    { x: 245, y: 56, zIndex: 3 },
    { x: 43, y: -168, zIndex: 1 },
    { x: -248, y: -78, zIndex: 2 },
  ]);

  const [currentOrder, setCurrentOrder] = useState([0, 1, 2, 3]);
  const [showToast, setShowToast] = useState(false);

  const bottomIndex = 0;
  const isMelodyAtBottom =
    images[currentOrder[bottomIndex]] === "/images/home/thumbnail3_melody.png";

  const rotateClockwise = () => {
    setCurrentOrder((prev) => [prev[3], prev[0], prev[1], prev[2]]);
  };

  const rotateCounterClockwise = () => {
    setCurrentOrder((prev) => [prev[1], prev[2], prev[3], prev[0]]);
  };

  const showToastMessage = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 950);
  };

  return (
    <div className="home-container container">
      <img
        src="/images/home/logo.png"
        alt="HarmoniKids"
        className="header-logo"
      />

      <img
        src="/images/home/learning.gif"
        alt="學習歷程入口"
        className="learning-path"
        onClick={() => navigate("/learning-path")}
      />

      <div className="diamond-container">
        {currentOrder.map((imgIndex, positionIndex) => {
          const isBottom = positionIndex === 0;
          const isLeft = positionIndex === 3;
          const isRight = positionIndex === 1;

          // 抽出行為處理
          const handleAction = () => {
            if (isLeft) {
              rotateClockwise();
            } else if (isRight) {
              rotateCounterClockwise();
            } else if (isBottom) {
              if (isMelodyAtBottom) {
                navigate("/melody/story");
              } else {
                showToastMessage();
              }
            }
          };

          return (
            <motion.div
              key={imgIndex}
              className={`diamond-item ${!isBottom ? "blurred" : ""}`}
              drag
              dragElastic={0.005}
              dragConstraints={{ left: -1, right: 1, top: -1, bottom: 1 }}
              onClick={handleAction}
              onDragEnd={(e, info) => {
                if (
                  Math.abs(info.offset.x) > 1 ||
                  Math.abs(info.offset.y) > 1
                ) {
                  handleAction();
                }
              }}
              animate={{
                x: positions[positionIndex].x,
                y: positions[positionIndex].y,
                scale: isBottom ? 1 : 0.8,
                opacity: isBottom ? 1 : 0.9,
                zIndex: positions[positionIndex].zIndex,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <img
                src={images[imgIndex]}
                alt={`img-${imgIndex}`}
                className="diamond-image"
              />
            </motion.div>
          );
        })}
      </div>

      <img
        src="/images/home/setting.png"
        alt="設定入口"
        className="settingBtn"
      />

      {showToast && (
        <motion.div
          className="toast-message"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          Not Available
        </motion.div>
      )}
    </div>
  );
}

export default Home;
