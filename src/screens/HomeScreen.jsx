import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/HomeScreen.css";
import NavBar from "../components/NavBar";

function HomeScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <>
      <NavBar />
      <div className="home-container">
        <div className="card home-card">
          <h1 className="title">Welcome, {user.first_name} 👋</h1>
          <p className="subtitle">
            Manage your poker sessions, track your results, and connect with friends.
          </p>

          <div className="home-actions">

            <button
              className="btn-primary"
              onClick={() => navigate("/create-group")}
            >
              Create New Group
            </button>

            {/* ⭐ NEW: Go to My Groups */}
            <button
              className="btn-primary"
              onClick={() => navigate("/my-groups")}
            >
              View My Groups
            </button>

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
    </>
  );
}

export default HomeScreen;
