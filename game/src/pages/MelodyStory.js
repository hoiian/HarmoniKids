import React from "react";
import { useNavigate } from "react-router-dom";

function MelodyStory() {
  const navigate = useNavigate();

  return (
    <div className="melody-story-container container">
      <div className="video-container">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/videos/melody_story_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {/* 返回首頁 */}
      <div className="BackBtn" onClick={() => navigate("/")}></div>
      <div className="storyText">
        皇后和她的士兵們走進洞穴，發現裡面意外地寬敞明亮，充滿著魔法的音符精靈，這些音符精靈隨著他們的腳步在牆上飛舞跳躍，時不時唱著各種旋律，講述著音符果實的誕生傳說。
      </div>
      <button
        className="arrow right"
        onClick={() => navigate("/melody/tutorial")}
      ></button>
    </div>
  );
}

export default MelodyStory;
