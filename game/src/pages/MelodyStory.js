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

  const handleClick = () => {
    if (videoRef.current) {
      videoRef.current.style.display = "block"; // 顯示影片
      setPlaying(true);
      videoRef.current.play();
    }
  };

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

  return (
    <div className="melody-story-container container">
      {/* <div className="video-container">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/videos/melody_story_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div> */}
      {/* 返回首頁 */}
      <div className="BackBtn" onClick={() => navigate("/")}></div>

      {/* <div className="story_next" onClick={handleClick}></div>

      {playing && (
        <video
          ref={videoRef}
          className="video-container"
          src="/videos/melody_story_next_transition.mp4"
          onEnded={handleEnded}
          muted
          playsInline
          style={{
            zIndex: 9999,
            transition: "opacity 0.5s ease-in-out", // 淡入效果
          }}
        />
      )} */}

      {/* 只有 showText 為 true 時才顯示文本 */}
      {showText && (
        <div className="storyText text-shadow-outline">
          皇后帶著士兵走進洞穴，發現裡面寬敞又明亮！魔法音符
          <br />
          精靈在牆上飛舞，隨著腳步跳動，還唱著旋律.........
        </div>
      )}
      <div
        className="story_next"
        onClick={() => navigate("/melody/tutorial")}
      ></div>

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
      />
    </div>
  );
}

export default MelodyStory;
