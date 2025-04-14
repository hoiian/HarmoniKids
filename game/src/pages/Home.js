import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { motion, useDragControls } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const dragControls = useDragControls();
  const bgmRef = useRef(null); // 🔊 背景音樂參考

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

  useEffect(() => {
    const savedOrder = localStorage.getItem("home_order");
    if (savedOrder) {
      setCurrentOrder(JSON.parse(savedOrder));
      localStorage.removeItem("home_order"); // 用完刪除避免污染
    }
  }, []);

  useEffect(() => {
    const tryPlay = () => {
      if (bgmRef.current && bgmRef.current.paused) {
        bgmRef.current.play();
      }
      // 一旦播放過，就移除事件
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("click", tryPlay);
    };

    window.addEventListener("touchstart", tryPlay);
    window.addEventListener("click", tryPlay);

    return () => {
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("click", tryPlay);
    };
  }, []);

  // ✅ 自動播放 BGM
  useEffect(() => {
    const bgm = bgmRef.current;
    if (bgm) {
      bgm.volume = 0.5;
      const playPromise = bgm.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("🔇 自動播放被阻止，需要用戶互動後播放", err);
        });
      }
    }
  }, []);

  return (
    <div className="home-container container">
      <audio ref={bgmRef} src="/audio/bgm.mov" loop preload="auto" />
      <img
        src="/images/home/logo.svg"
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
          const isTop = positionIndex === 2;
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
                localStorage.setItem(
                  "home_order",
                  JSON.stringify(currentOrder)
                );
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
              drag={isLeft || isRight}
              dragElastic={0.005}
              onClick={handleAction}
              onDragEnd={(e, info) => {
                // 小移動不觸發行為，直接還原位置
                if (
                  Math.abs(info.offset.x) > 1 ||
                  Math.abs(info.offset.y) > 1
                ) {
                  handleAction(); // 認定為拖動
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
