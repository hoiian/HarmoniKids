import React from "react";
import { useNavigate } from "react-router-dom";
// import "./LearningPathPage.css";

function LearningPathPage() {
  const navigate = useNavigate();

  return (
    <div className="learning-container container">
      <div className="BackBtn_learningpath" onClick={() => navigate("/")}></div>
      <h1>學習歷程</h1>

      <div className="successRate">
        <div className="title">
          <h2>成功率</h2>
          <div>
            <span>75</span>
            <span>%</span>
          </div>
        </div>
        <img src="/images/learningPath/progressBar.png" alt="Progress Bar" />
      </div>

      <div className="performance">
        <h2>你的表現</h2>
        <div>
          <img src="/images/learningPath/star_on.png" alt="performance" />
          <img src="/images/learningPath/star_on.png" alt="performance" />
          <img src="/images/learningPath/star_off.png" alt="performance" />
        </div>
      </div>
      <img
        src="/images/learningPath/rightIll.png"
        alt="performance illustration"
        className="rightIll"
      />
      <div className="bottomSelection">
        <img src="/images/learningPath/book_entry1.png" alt="selection" />
        <img src="/images/learningPath/book_entry2.png" alt="selection" />
        <img src="/images/learningPath/book_entry3.png" alt="selection" />
        <img src="/images/learningPath/book_entry4.png" alt="selection" />
        <img src="/images/learningPath/book_entry5.png" alt="selection" />
      </div>
    </div>
  );
}

export default LearningPathPage;
