import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HandwritingCanvas from "./components/HandwritingCanvas";
import SentenceCanvas from "./components/SentenceCanvas";
import HandwritingCollector from "./components/HandwritingCollector";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="app">
                <Sidebar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HandwritingCanvas />} />
                        <Route path="/sentence" element={<SentenceCanvas />} />
                        <Route
                            path="/collect"
                            element={<HandwritingCollector />}
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
