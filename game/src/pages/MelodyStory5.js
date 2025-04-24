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
      style={{ backgroundImage: `url("/images/melody/bg_story5.gif")` }}
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
        <div className="storyText text-shadow-outline" style={{ top: "223px" }}>
          從此，噪音國再也沒有刺耳的聲響，每個角落
          <br />
          都響著和平又快樂的旋律......
        </div>
      )}

      <button
        className="arrow left"
        onClick={() => navigate("/melody/game")}
      ></button>
      {/* <button
        className="arrow right"
        onClick={() => navigate("/melody/story4")}
      ></button> */}

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
