import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const images = [
    "/images/home/thumbnail1_rhythm.png",
    "/images/home/thumbnail2_pitch.png",
    "/images/home/thumbnail3_melody.png",
    "/images/home/thumbnail4_lock.png",
  ];

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
      {/* <DiamondGrid /> */}
      <div className="diamond-container">
        {images.map((src, index) => (
          <Link
            to={index === 2 ? "/melody/story" : "#"} // 只有第 3 張圖片可以跳轉
            key={index}
            className={index === 2 ? "clickable" : "non-clickable"} // 加 class 控制樣式
          >
            <img src={src} alt={`img-${index}`} className="diamond-image" />
          </Link>
        ))}
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
