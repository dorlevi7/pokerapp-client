import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/HomeScreen.css";
import NavBar from "../components/NavBar";
import FloatingDecorations from "../components/FloatingDecorations";
import { toast } from "react-hot-toast";

function HomeScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const animations = ["float", "sway", "bounce", "spin"];
  const [currentAnim, setCurrentAnim] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnim((prev) => (prev + 1) % animations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  return (
    <>
      <NavBar />

      {/* =======================================
          🌟 FLOATING CARDS + CHIPS COMPONENT
      ========================================= */}
      <FloatingDecorations />

      {/* =======================================
          🏠 MAIN HOME CARD
      ========================================= */}
      <div className="home-container">
        <div className="card home-card">
          <h1 className="title">Welcome, {user.first_name} 👋</h1>
          <p className="subtitle">
            Manage your poker sessions, track your results, and connect with friends.
          </p>

          <div className="home-actions">
            <button
              className="btn-primary btn-purple"
              onClick={() => navigate("/create-group")}
            >
              Create New Group
            </button>

            <button
              className="btn-primary btn-blue"
              onClick={() => navigate("/my-groups")}
            >
              View My Groups
            </button>

            <button
              className="btn-primary btn-green"
              onClick={() =>
                toast("Coming soon!", { icon: "🃏" })
              }
            >
              Start New Game
            </button>

            <button
              className="btn-primary btn-gray"
              onClick={() =>
                toast("Feature under construction!", { icon: "🚧" })
              }
            >
              View Statistics
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeScreen;
