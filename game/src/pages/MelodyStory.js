import React from "react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MelodyMenu from "./MelodyMenu";

function MelodyStory() {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false); // 控制文本顯示
  const [lastVisited, setLastVisited] = useState(""); // 上次到訪時間
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const navigate = useNavigate();
  const bgmRef = useRef(null);
  const storyAudioRef = useRef(null);

  const playStoryAudio = () => {
    if (storyAudioRef.current) {
      storyAudioRef.current
        .play()
        .catch((err) => console.warn("🔇 播放故事音效失敗", err));
    }
  };

  const handleClick = () => {
    const bgm = bgmRef.current;
    if (bgm) {
      bgm.pause();
    }

    setPlaying(true); // ✅ 先顯示 <video>
  };

  useEffect(() => {
    if (playing && videoRef.current) {
      const video = videoRef.current;
      video.style.display = "block";
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => console.warn("播放失敗", err));
      }
    }
  }, [playing]);

  const handleEnded = () => {
    navigate("/melody/tutorial");
  };

  useEffect(() => {
    // 取得上次到訪時間（從 localStorage）
    const savedTime = localStorage.getItem("lastVisited");
    if (savedTime) {
      setLastVisited(savedTime);
    }

    // 更新當前到訪時間
    const now = new Date().toLocaleDateString("zh-CN"); // e.g. "2024/03/10"
    localStorage.setItem("lastVisited", now);
  }, []);

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
    <div className="melody-story-container container">
      <div className="melody-cover"></div>
      <audio
        ref={bgmRef}
        src="/audio/bgm_melody_story.mov"
        loop
        preload="auto"
      />
      {/* <div className="video-container">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/videos/melody_story_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div> */}
      {/* 返回首頁 */}
      <div className="BackBtn" onClick={() => navigate("/")}></div>
      {/* <div
        className="story_next"
        onClick={() => navigate("/melody/tutorial")}
      ></div> */}
      <img
        src="/images/melody/story1_indicator.gif"
        className="clickme"
        alt="performance"
      />
      <div className="story_next" onClick={handleClick}></div>

      {playing && (
        <video
          ref={videoRef}
          className="video-container"
          src="/videos/melody_story_next_transition.mp4"
          onEnded={handleEnded}
          autoPlay
          // muted
          playsInline
          style={{
            zIndex: 9999,
            height: "auto",
            objectFit: "cover",
          }}
        />
      )}

      {/* 只有 showText 為 true 時才顯示文本 */}
      {showText && (
        <div className="storyText text-shadow-outline">
          皇后帶著士兵走進洞穴，魔法音符
          <br />
          精靈在牆上飛舞.........
        </div>
      )}

      <audio
        ref={storyAudioRef}
        src="/audio/narrator_melody_story.MP3"
        preload="auto"
      />

      {/* 上次到訪的 badge */}
      <div className="last-visit-badge">
        <div className="badge-icon"></div>
        <div className="visit-time">{lastVisited || "首次訪問"}</div>
      </div>

      {/* Menu */}
      <MelodyMenu
        isOpen={isOpen}
        showText={showText}
        setShowText={setShowText}
        onlyShow="story"
        playStoryAudio={playStoryAudio}
      />
    </div>
  );
}

export default MelodyStory;
