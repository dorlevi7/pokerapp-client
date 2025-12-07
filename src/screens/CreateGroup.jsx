import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/CreateGroup.css";

function CreateGroup() {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [playerInput, setPlayerInput] = useState("");
  const [players, setPlayers] = useState([]);

  const addPlayer = () => {
    const trimmed = playerInput.trim();
    if (!trimmed) return;

    // Prevent duplicates
    if (players.includes(trimmed)) {
      alert("This player is already in the list.");
      return;
    }

    setPlayers((prev) => [...prev, trimmed]);
    setPlayerInput("");
  };

  const removePlayer = (index) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert("Please enter a group name.");
      return;
    }

    if (players.length === 0) {
      alert("Please add at least one player.");
      return;
    }

    // For now — just simulate creation
    console.log("Group Created:", {
      name: groupName,
      players: players,
    });

    alert("Group created successfully!");
    navigate("/home");
  };

  return (
    <>
      <NavBar />

      <div className="create-group-container">
        <div className="card create-group-card">
          <h1 className="title">Create New Group</h1>
          <p className="subtitle">Set a name and add players.</p>

          <input
            type="text"
            className="input-field"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <div className="player-input-row">
            <input
              type="text"
              className="input-field"
              placeholder="Player email or username"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
            />

            <button className="btn-primary small-btn" onClick={addPlayer}>
              Add
            </button>
          </div>

          {/* Players List */}
          {players.length > 0 && (
            <ul className="players-list">
              {players.map((p, index) => (
                <li key={index} className="player-item">
                  {p}
                  <button
                    className="remove-btn"
                    onClick={() => removePlayer(index)}
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button className="btn-primary create-btn" onClick={handleCreateGroup}>
            Create Group
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateGroup;
