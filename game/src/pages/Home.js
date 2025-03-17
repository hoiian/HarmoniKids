import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const images = [
    "/images/home/thumbnail1_rhythm.png",
    "/images/home/thumbnail2_pitch.png",
    "/images/home/thumbnail3_melody.png",
    "/images/home/thumbnail4_lock.png",
  ];

  const [positions, setPositions] = useState([
    { x: -33, y: 128, zIndex: 4 }, // 下
    { x: 245, y: 56, zIndex: 3 }, // 右
    { x: 43, y: -168, zIndex: 1 }, // 上
    { x: -248, y: -78, zIndex: 2 }, // 左
  ]);

  // **順時針旋轉**
  const rotateClockwise = () => {
    setPositions((prev) => [prev[3], prev[0], prev[1], prev[2]]);
  };

  // **逆時針旋轉**
  const rotateCounterClockwise = () => {
    setPositions((prev) => [prev[1], prev[2], prev[3], prev[0]]);
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
        {images.map((src, index) => {
          const isBottom = index === 0; // 當前圖片是否在下方
          return (
            <Link
              to={isBottom ? "/melody/story" : "#"} // 只有下方圖片可跳轉
              key={index}
              className={`diamond-item ${!isBottom ? "blurred" : ""}`}
              onClick={(e) => {
                if (index === 1) rotateClockwise(); // 點擊右方圖片 → 順時針旋轉
                if (index === 3) rotateCounterClockwise(); // 點擊左方圖片 → 逆時針旋轉
                if (!isBottom) e.preventDefault(); // 防止未到達下方時的點擊跳轉
              }}
              style={{
                transform: `translate(-50%, -50%) translate(${positions[index].x}px, ${positions[index].y}px)`,
                zIndex: positions[index].zIndex,
              }}
            >
              <img src={src} alt={`img-${index}`} className="diamond-image" />
            </Link>
          );
        })}
      </div>

      <img
        src="/images/home/setting.png"
        alt="設定入口"
        className="settingBtn"
      />
    </div>
  );
}

export default Home;
