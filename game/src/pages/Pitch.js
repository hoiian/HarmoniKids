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
    <div className="melody-tutorial-container container">
      <div className="sticker pitch"></div>
      <audio
        ref={bgmRef}
        src="/audio/bgm_melody_tutorial_new.mp3"
        loop
        preload="auto"
      />
      {/* <h1>Melody Tutorial Page</h1> */}
      <div className="BackBtn" onClick={() => navigate("/")}></div>
      <div className="video-container">
        <video
          autoPlay
          playsInline
          onEnded={() => {
            if (bgmRef.current) {
              bgmRef.current.play().catch((err) => {
                console.warn("🔇 重新播放 BGM 失敗", err);
              });
            }
            navigate("/melody/result");
          }}
        >
          <source src="/videos/pitch.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* 只有 showText 為 true 時才顯示文本 */}
      {/* {showText && (
        <div className="storyText text-shadow-outline">
          魔法音符精靈們一邊扭動可愛的小身體，
          <br />
          一邊唱出忽高忽低的聲音。
        </div>
      )}

      <button
        className="arrow left"
        onClick={() => navigate("/melody/story")}
      ></button>
      <button
        className="arrow right"
        onClick={() => navigate("/melody/tutorial2")}
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
