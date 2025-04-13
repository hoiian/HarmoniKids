import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MelodyMenu from "./MelodyMenu"; // 引入 MelodyMenu

const MelodyTutorial = () => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false); // 控制文本顯示
  document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("bgVideo");

    setTimeout(() => {
      video.muted = false; // 取消靜音
      video.volume = 1.0; // 設定音量
      video.play().catch((error) => console.log("自動播放被阻止", error));
    }, 1000);
  });

  return (
    <div className="melody-tutorial-container container">
      {/* <h1>Melody Tutorial Page</h1> */}
      <div className="BackBtn" onClick={() => navigate("/")}></div>
      <div className="video-container">
        <video autoPlay playsInline>
          <source src="/videos/melody_tutorial.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* 只有 showText 為 true 時才顯示文本 */}
      {showText && (
        <div className="storyText text-shadow-outline">
          皇后帶著士兵走進洞穴，發現裡面寬敞又明亮！魔法音符精靈 <br />
          在牆上飛舞，隨著腳步跳動，還唱著旋律，講述音符果實的神秘傳說。
        </div>
      )}

      <button
        className="arrow left"
        onClick={() => navigate("/melody/story")}
      ></button>
      <button
        className="arrow right"
        onClick={() => navigate("/melody/game")}
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
