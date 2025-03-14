import { useNavigate } from "react-router-dom";

const MelodyGame = () => {
  const navigate = useNavigate();

  return (
    <div className="melody-game-container container">
      <div className="video-container">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/videos/melody_game_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div
        className="BackBtn BackBtn_black"
        onClick={() => navigate("/")}
      ></div>
      <button
        className="arrow left"
        onClick={() => navigate("/melody/tutorial")}
      ></button>
    </div>
  );
};

export default MelodyGame;
