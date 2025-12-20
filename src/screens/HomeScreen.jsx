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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <>
      <NavBar />

      {/* =======================================
          🌟 FLOATING CARDS + CHIPS COMPONENT
      ========================================= 
      <FloatingDecorations />
      */}

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
