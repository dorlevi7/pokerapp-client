import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/HomeScreen.css";
import NavBar from "../components/NavBar";
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
          🎴 FLOATING 3D CARDS
      ========================================= */}

      {/* CARD 1 */}
      <div className="card-wrapper card1-wrapper">
        <div className="card-inner">
          <div
            className="card-face"
            style={{ backgroundImage: "url('/card1.png')" }}
          ></div>
          <div className="card-face card-back"></div>
        </div>
      </div>

      {/* CARD 2 */}
      <div className="card-wrapper card2-wrapper">
        <div className="card-inner">
          <div
            className="card-face"
            style={{ backgroundImage: "url('/card2.png')" }}
          ></div>
          <div className="card-face card-back"></div>
        </div>
      </div>

      {/* CARD 3 */}
      <div className="card-wrapper card3-wrapper">
        <div className="card-inner">
          <div
            className="card-face"
            style={{ backgroundImage: "url('/card.png')" }}
          ></div>
          <div className="card-face card-back"></div>
        </div>
      </div>

      {/* CARD 4 */}
      <div className="card-wrapper card4-wrapper">
        <div className="card-inner">
          <div
            className="card-face"
            style={{ backgroundImage: "url('/card3.png')" }}
          ></div>
          <div className="card-face card-back"></div>
        </div>
      </div>

      {/* =======================================
          🎲 FLOATING 3D DOUBLE-SIDED CHIPS
      ========================================= */}

      {/* MAIN CHIP */}
      <div className="chip-wrapper">
        <div className="chip-inner">
          <div
            className="chip-face chip-front"
            style={{ backgroundImage: "url('/chip.png')" }}
          ></div>
          <div
            className="chip-face chip-back"
            style={{ backgroundImage: "url('/chip.png')" }}
          ></div>
        </div>
      </div>

      {/* CHIP 1 */}
      <div className="chip-wrapper chip1">
        <div className="chip-inner">
          <div
            className="chip-face chip-front"
            style={{ backgroundImage: "url('/chip1.png')" }}
          ></div>
          <div
            className="chip-face chip-back"
            style={{ backgroundImage: "url('/chip1.png')" }}
          ></div>
        </div>
      </div>

      {/* CHIP 2 */}
      <div className="chip-wrapper chip2">
        <div className="chip-inner">
          <div
            className="chip-face chip-front"
            style={{ backgroundImage: "url('/chip2.png')" }}
          ></div>
          <div
            className="chip-face chip-back"
            style={{ backgroundImage: "url('/chip2.png')" }}
          ></div>
        </div>
      </div>

      {/* CHIP 3 */}
      <div className="chip-wrapper chip3">
        <div className="chip-inner">
          <div
            className="chip-face chip-front"
            style={{ backgroundImage: "url('/chip3.png')" }}
          ></div>
          <div
            className="chip-face chip-back"
            style={{ backgroundImage: "url('/chip3.png')" }}
          ></div>
        </div>
      </div>

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
