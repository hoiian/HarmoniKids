import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import MelodyMenu from "./MelodyMenu"; // 引入 MelodyMenu

const MelodyTutorial = () => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false); // 控制文本顯示
  const bgmRef = useRef(null);

  document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("bgVideo");

    setTimeout(() => {
      video.muted = false; // 取消靜音
      video.volume = 1.0; // 設定音量
      video.play().catch((error) => console.log("自動播放被阻止", error));
    }, 1000);
  });

  // play bgm
  useEffect(() => {
    const bgm = bgmRef.current;
    if (bgm) {
      bgm.volume = 0.6;
      bgm.play().catch((err) => {
        console.warn("🔇 自動播放失敗：需要用戶互動", err);
      });
    }
  }, []);

  return (
    <div
      className="container"
      style={{ backgroundImage: `url("/images/melody/bg_story3.gif")` }}
    >
      <div className="melody-cover"></div>
      <audio
        ref={bgmRef}
        src="/audio/bgm_melody_tutorial_new.mov"
        loop
        preload="auto"
      />
      {/* <h1>Melody Tutorial Page</h1> */}
      <div className="BackBtn" onClick={() => navigate("/")}></div>

      {/* 只有 showText 為 true 時才顯示文本 */}
      {showText && (
        <div className="storyText text-shadow-outline">
          走進城堡，噪音魔王把城堡搞得雞飛狗跳，皇后舉
          <br />
          起指揮棒，士兵們舉起樂器，旋律朝魔王飛去。
        </div>
      )}

      <button
        className="arrow left"
        onClick={() => navigate("/melody/tutorial3")}
      ></button>
      <button
        className="arrow right"
        onClick={() => navigate("/melody/story4")}
      ></button>

      {/* Menu */}
      <MelodyMenu
        showText={showText}
        setShowText={setShowText}
        onlyShow="story"
      />
    </div>
  );
};

export default MelodyTutorial;
