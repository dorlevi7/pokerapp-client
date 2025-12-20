import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/GameSettingsScreen.css";

function GameSettingsScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [buyIn, setBuyIn] = useState(20);
  const [allowRebuy, setAllowRebuy] = useState(true);
  const [notes, setNotes] = useState("");

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}/members`);
      const data = await res.json();

      if (data.success) {
        setMembers(data.data);
        setSelectedPlayers(data.data.map((m) => m.id));
      }
    };

    fetchMembers();
  }, [groupId, API_BASE_URL]);

  function togglePlayer(id) {
    setSelectedPlayers((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  }

  function startGame() {
    navigate(`/group/${groupId}/game`);
  }

  return (
    <>
      <NavBar />

      <div className="screen-container">
        <div className="card screen-card">
          <h1 className="title">GAME SETTINGS</h1>

        {/* ------------------------ Players ------------------------ */}
        <h2 className="subtitle">Players</h2>

        <ul className="player-list">
        {members.map((m) => (
            <li key={m.id} className="player-item">
            <label className="checkbox-row">
                <input
                type="checkbox"
                checked={selectedPlayers.includes(m.id)}
                onChange={() => togglePlayer(m.id)}
                />
                {m.username}
            </label>
            </li>
        ))}
        </ul>

        {/* ------------------------ Allow Rebuy ------------------------ */}
        <h2 className="subtitle">Rebuy Settings</h2>

        <div className="player-item rebuy-item">
        <label className="checkbox-row">
            <input
            type="checkbox"
            checked={allowRebuy}
            onChange={() => setAllowRebuy((prev) => !prev)}
            />
            Allow Rebuy?
        </label>
        </div>

          {/* ------------------------ Buy-in ------------------------ */}
          <div className="field">
            <label className="field-label">Buy-in Amount (₪)</label>
            <input
              type="number"
              className="input"
              value={buyIn}
              onChange={(e) => setBuyIn(Number(e.target.value))}
            />
          </div>

          {/* ------------------------ Notes ------------------------ */}
          <div className="field">
            <label className="field-label">Notes</label>
            <textarea
              className="textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes for this game..."
            />
          </div>

          {/* ------------------------ Buttons ------------------------ */}
          <button className="btn-primary action-btn" onClick={startGame}>
            Start Game
          </button>

          <button
            className="btn-secondary back-btn"
            onClick={() => navigate(`/group/${groupId}`)}
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </>
  );
}

export default GameSettingsScreen;
