import { useNavigate } from "react-router-dom";

const MelodyTutorial = () => {
  const navigate = useNavigate();
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
        <video autoPlay loop playsInline>
          <source src="/videos/melody_tutorial.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <button
        className="arrow left"
        onClick={() => navigate("/melody/story")}
      ></button>
      <button
        className="arrow right"
        onClick={() => navigate("/melody/game")}
      ></button>
    </div>
  );
};

export default MelodyTutorial;
