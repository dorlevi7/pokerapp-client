import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/home")}>
        🃏 PokerApp
      </div>

      <div className="navbar-links">
        <button
          className={`nav-btn ${location.pathname === "/home" ? "active" : ""}`}
          onClick={() => navigate("/home")}
        >
          Home
        </button>

        <button
          className={`nav-btn ${
            location.pathname === "/profile" ? "active" : ""
          }`}
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>

        <button className="nav-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
