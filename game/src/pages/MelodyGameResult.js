import { useNavigate } from "react-router-dom";

const MelodyGameResult = () => {
  const navigate = useNavigate();

  return (
    <div className="melody-result-container container">
      {/* 返回按鈕 */}
      {/* <div
        className="BackBtn BackBtn_black"
        onClick={() => navigate("/melody/game")}
      ></div> */}

      {/* 主要圖片 */}
      <div className="result-image"></div>

      {/* 文字區域 */}

      <h1 className="result-text">正確！你做得很好</h1>

      <div className="performance">
        <h2>你的表現</h2>
        <div>
          <img src="/images/learningPath/star_on.png" alt="performance" />
          <img src="/images/learningPath/star_on.png" alt="performance" />
          {/* <img src="/images/learningPath/star_on.png" alt="performance" /> */}
        </div>
      </div>

      <div
        className="result-next"
        onClick={() => navigate("/melody/story")}
      ></div>
    </div>
  );
};

export default MelodyGameResult;
