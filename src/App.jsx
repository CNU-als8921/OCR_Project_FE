import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HandwritingCanvas from './components/HandwritingCanvas';
import SentenceCanvas from './components/SentenceCanvas';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="nav-menu">
          <Link to="/" className="nav-link">단어 인식</Link>
          <Link to="/sentence" className="nav-link">문장 인식</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<HandwritingCanvas />} />
          <Route path="/sentence" element={<SentenceCanvas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 