import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import MelodyMenu from "./MelodyMenu"; // 引入 MelodyMenu

const MelodyTutorial = () => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false); // 控制文本顯示
  const bgmRef = useRef(null);
  const storyAudioRef = useRef(null);

  const playStoryAudio = () => {
    if (storyAudioRef.current) {
      storyAudioRef.current
        .play()
        .catch((err) => console.warn("🔇 播放故事音效失敗", err));
    }
  };

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
      <div className="sticker"></div>
      <audio
        ref={bgmRef}
        src="/audio/bgm_melody_tutorial_new.mov"
        loop
        preload="auto"
      />
      {/* <h1>Melody Tutorial Page</h1> */}
      <div className="BackBtn" onClick={() => navigate("/")}></div>
      <div className="video-container">
        <video autoPlay playsInline>
          <source src="/videos/melody_tutorial3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* 只有 showText 為 true 時才顯示文本 */}
      {showText && (
        <div className="storyText text-shadow-outline">
          士兵們合力演奏，
          <br />
          一起邊走邊數：「一、二、三、四！」
        </div>
      )}

      <audio
        ref={storyAudioRef}
        src="/audio/narrator_melody_tutorial3.MP3"
        preload="auto"
      />

      <button
        className="arrow left"
        onClick={() => navigate("/melody/story2")}
      ></button>
      <button
        className="arrow right"
        onClick={() => navigate("/melody/story3")}
      ></button>

      {/* Menu */}
      <MelodyMenu
        showText={showText}
        setShowText={setShowText}
        onlyShow="story"
        playStoryAudio={playStoryAudio}
      />
    </div>
  );
};

export default MelodyTutorial;
