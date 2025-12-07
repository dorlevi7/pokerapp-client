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
      <div className="navbar-logo" onClick={() => navigate("/home")}>
        🃏 PokerApp
      </div>

      {/* DESKTOP LINKS */}
      <div className="navbar-links desktop-only">
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

      {/* MOBILE HAMBURGER ICON */}
      <div className="hamburger mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="mobile-menu mobile-only">
          <button
            className={`mobile-item ${
              location.pathname === "/home" ? "active" : ""
            }`}
            onClick={() => {
              navigate("/home");
              setMenuOpen(false);
            }}
          >
            Home
          </button>

          <button
            className={`mobile-item ${
              location.pathname === "/profile" ? "active" : ""
            }`}
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
      )}
    </nav>
  );
}

export default NavBar;
