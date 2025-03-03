import { useNavigate } from "react-router-dom";

const MelodyGame = () => {
  const navigate = useNavigate();

  return (
    <div className="melody-game-container container">
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
