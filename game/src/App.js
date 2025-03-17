import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // 主畫面
import LearningPathPage from "./pages/LearningPathPage"; // 學習歷程頁面
import MelodyStory from "./pages/MelodyStory";
import MelodyTutorial from "./pages/MelodyTutorial";
import MelodyGame from "./pages/MelodyGame";
import MelodyGameResult from "./pages/MelodyGameResult";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learning-path" element={<LearningPathPage />} />
        <Route path="/melody/story" element={<MelodyStory />} />
        <Route path="/melody/tutorial" element={<MelodyTutorial />} />
        <Route path="/melody/game" element={<MelodyGame />} />
        <Route path="/melody/result" element={<MelodyGameResult />} />
      </Routes>
    </Router>
  );
}

export default App;
