import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="navbar-logo" onClick={() => navigate("/home")}>
        🃏 PokerApp
      </div>

      {/* DESKTOP MENU */}
      <div className="navbar-links">

        <button
          className={`nav-btn ${location.pathname === "/home" ? "active" : ""}`}
          onClick={() => navigate("/home")}
        >
          Home
        </button>

        <button
          className={`nav-btn ${location.pathname === "/notifications" ? "active" : ""}`}
          onClick={() => navigate("/notifications")}
        >
          Notifications
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

      {/* MOBILE HAMBURGER ICON */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        ☰
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>

        <button
          className={`mobile-item ${location.pathname === "/home" ? "active" : ""}`}
          onClick={() => {
            navigate("/home");
            setMenuOpen(false);
          }}
        >
          Home
        </button>

        <button
          className={`mobile-item ${location.pathname === "/notifications" ? "active" : ""}`}
          onClick={() => {
            navigate("/notifications");
            setMenuOpen(false);
          }}
        >
          Notifications
        </button>

        <button
          className={`mobile-item ${location.pathname === "/profile" ? "active" : ""}`}
          onClick={() => {
            navigate("/profile");
            setMenuOpen(false);
          }}
        >
          Profile
        </button>

        <button
          className="mobile-item logout-btn"
          onClick={() => {
            handleLogout();
            setMenuOpen(false);
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
