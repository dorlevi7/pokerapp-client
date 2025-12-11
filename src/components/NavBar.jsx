import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

  // ⭐ Fetch unread notifications count
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    async function loadUnread() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/notifications/user/${user.id}`,
          { headers: { "Content-Type": "application/json" } }
        );
        const data = await res.json();

        if (data.success) {
          const unread = data.data.filter((n) => !n.is_read).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("❌ Failed to load unread count:", err);
      }
    }

    loadUnread();
  }, []);

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

        {/* ⭐ Notifications with Badge */}
        <div className="notif-wrapper">
          <button
            className={`nav-btn notifications-link ${
              location.pathname === "/notifications" ? "active" : ""
            }`}
            onClick={() => navigate("/notifications")}
          >
            Notifications
          </button>

          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount}</span>
          )}
        </div>

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
      <div className="hamburger" onClick={() => setMenuOpen((prev) => !prev)}>
        ☰
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
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
          className={`mobile-item notifications-link ${
            location.pathname === "/notifications" ? "active" : ""
          }`}
          onClick={() => {
            navigate("/notifications");
            setMenuOpen(false);
          }}
        >
          Notifications
          {unreadCount > 0 && (
            <span className="notif-badge mobile-badge">{unreadCount}</span>
          )}
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
    </nav>
  );
}

export default NavBar;
