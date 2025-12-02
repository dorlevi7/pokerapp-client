import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css"; // עיצוב כללי
import "../styles/HomeScreen.css"; // עיצוב ייחודי למסך הבית

function HomeScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 🧠 טוען את פרטי המשתמש מה־localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // אם אין משתמש שמור — ננתב למסך login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    // ✅ מנקה נתונים מקומיים
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null; // מונע הבזק לפני שהנתונים נטענים

  return (
    <div className="home-container">
      <div className="card home-card">
        <h1 className="title">Welcome, {user.first_name} 👋</h1>
        <p className="subtitle">
          Manage your poker sessions, track your results, and connect with friends.
        </p>

        <div className="home-actions">
          <button
            className="btn-primary"
            onClick={() => alert("Coming soon!")}
          >
            Start New Game
          </button>

          <button
            className="btn-secondary"
            onClick={() => alert("Feature under construction!")}
          >
            View Statistics
          </button>

          <button className="btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
