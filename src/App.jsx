import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HandwritingCanvas from "./components/HandwritingCanvas";
import SentenceCanvas from "./components/SentenceCanvas";
import HandwritingCollector from "./components/HandwritingCollector";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="nav-menu">
                    <Link to="/" className="nav-link">
                        단어 인식
                    </Link>
                    <Link to="/sentence" className="nav-link">
                        문장 인식
                    </Link>
                    <Link to="/collect" className="nav-link">
                        데이터 수집
                    </Link>
                </nav>

                <Routes>
                    <Route path="/" element={<HandwritingCanvas />} />
                    <Route path="/sentence" element={<SentenceCanvas />} />
                    <Route path="/collect" element={<HandwritingCollector />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
