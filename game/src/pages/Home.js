import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const images = [
    "/images/home/thumbnail1_rhythm.png",
    "/images/home/thumbnail2_pitch.png",
    "/images/home/thumbnail3_melody.png", // Melody
    "/images/home/thumbnail4_lock.png",
  ];

  const [positions, setPositions] = useState([
    { x: -33, y: 128, zIndex: 4 }, // 下
    { x: 245, y: 56, zIndex: 3 }, // 右
    { x: 43, y: -168, zIndex: 1 }, // 上
    { x: -248, y: -78, zIndex: 2 }, // 左
  ]);

  const [currentOrder, setCurrentOrder] = useState([0, 1, 2, 3]); // 控制當前圖片的順序
  const [showToast, setShowToast] = useState(false); // 控制 toast 顯示

  // 確認當前下方 item 是哪個
  const bottomIndex = 0;
  const isMelodyAtBottom =
    images[currentOrder[bottomIndex]] === "/images/home/thumbnail3_melody.png";

  // **順時針旋轉**
  const rotateClockwise = () => {
    setCurrentOrder((prev) => [prev[3], prev[0], prev[1], prev[2]]);
  };

  // **逆時針旋轉**
  const rotateCounterClockwise = () => {
    setCurrentOrder((prev) => [prev[1], prev[2], prev[3], prev[0]]);
  };

  // **顯示 Toast 並在 3 秒後消失**
  const showToastMessage = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 1900);
  };

  return (
    <div className="home-container container">
      {/* 標題 Logo */}
      <img
        src="/images/home/logo.png"
        alt="HarmoniKids"
        className="header-logo"
      />

      {/* 左下角學習歷程圖片，點擊時跳轉 */}
      <img
        src="/images/home/learning.png"
        alt="學習歷程入口"
        className="learning-path"
        onClick={() => navigate("/learning-path")}
      />

      {/* 菱形圖片 */}
      <div className="diamond-container">
        {currentOrder.map((imgIndex, positionIndex) => {
          const isBottom = positionIndex === bottomIndex;
          const isLeft = positionIndex === 3;
          const isRight = positionIndex === 1;
          const isTop = positionIndex === 2;

          return (
            <motion.div
              key={imgIndex}
              className={`diamond-item ${!isBottom ? "blurred" : ""}`}
              onClick={(e) => {
                if (isLeft) {
                  rotateClockwise(); // 點擊左方圖片 → 順時針旋轉
                } else if (isRight) {
                  rotateCounterClockwise(); // 點擊右方圖片 → 逆時針旋轉
                } else if (isBottom) {
                  if (isMelodyAtBottom) {
                    navigate("/melody/story");
                  } else {
                    showToastMessage(); // 顯示 Not Available Toast
                  }
                }
              }}
              animate={{
                x: positions[positionIndex].x,
                y: positions[positionIndex].y,
                scale: isBottom ? 1 : 0.8, // 當圖片在底部時稍微放大
                opacity: isBottom ? 1 : 0.9, // 底部圖片完全顯示，其他略透明
                zIndex: positions[positionIndex].zIndex,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }} // 平滑動畫
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

      {/* Toast 提示 */}
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
