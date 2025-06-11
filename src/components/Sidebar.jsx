import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1>OCR Project</h1>
            </div>
            <nav className="sidebar-nav">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <span className="nav-icon">📝</span>
                    <span className="nav-text">단어 인식</span>
                </NavLink>
                <NavLink
                    to="/sentence"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <span className="nav-icon">📄</span>
                    <span className="nav-text">문장 인식</span>
                </NavLink>
                <NavLink
                    to="/collect"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <span className="nav-icon">✏️</span>
                    <span className="nav-text">데이터 수집</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
