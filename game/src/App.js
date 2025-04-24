import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // 主畫面
import LearningPathPage from "./pages/LearningPathPage"; // 學習歷程頁面
import MelodyStory from "./pages/MelodyStory";
import MelodyStory2 from "./pages/MelodyStory2";
import MelodyStory3 from "./pages/MelodyStory3";
import MelodyStory4 from "./pages/MelodyStory4";
import MelodyStory5 from "./pages/MelodyStory5";
import MelodyTutorial from "./pages/MelodyTutorial";
import MelodyTutorial2 from "./pages/MelodyTutorial2";
import MelodyTutorial3 from "./pages/MelodyTutorial3";
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
        <Route path="/melody/story2" element={<MelodyStory2 />} />
        <Route path="/melody/story3" element={<MelodyStory3 />} />
        <Route path="/melody/story4" element={<MelodyStory4 />} />
        <Route path="/melody/story5" element={<MelodyStory5 />} />
        <Route path="/melody/tutorial" element={<MelodyTutorial />} />
        <Route path="/melody/tutorial2" element={<MelodyTutorial2 />} />
        <Route path="/melody/tutorial3" element={<MelodyTutorial3 />} />
        <Route path="/melody/game" element={<MelodyGame />} />
        <Route path="/melody/result" element={<MelodyGameResult />} />
      </Routes>
    </Router>
  );
}

export default App;
