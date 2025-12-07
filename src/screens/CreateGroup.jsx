import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/CreateGroup.css";

function CreateGroup() {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [playerInput, setPlayerInput] = useState("");
  const [players, setPlayers] = useState([]);

  // ✅ Detect environment like LoginScreen
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

  // 🔍 Add player with backend validation
  const addPlayer = async () => {
    const trimmed = playerInput.trim();
    if (!trimmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/exists?query=${encodeURIComponent(trimmed)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert("Server error while checking user.");
        return;
      }

      if (!data.exists) {
        alert("No user found with that email or username.");
        return;
      }

      const user = data.user; // { id, username, email }

      // Prevent duplicates
      if (players.find((p) => p.id === user.id)) {
        alert("This user is already in the list.");
        return;
      }

      setPlayers((prev) => [...prev, user]);
      setPlayerInput("");
    } catch (err) {
      console.error("Error checking user:", err);
      alert("Error communicating with server.");
    }
  };

  // ❌ Remove player
  const removePlayer = (index) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  // 🟢 Create group — NOW USING SERVER API
const handleCreateGroup = async () => {
  if (!groupName.trim()) {
    alert("Please enter a group name.");
    return;
  }

  if (players.length === 0) {
    alert("Please add at least one player.");
    return;
  }

  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) {
    alert("User session expired. Please log in again.");
    navigate("/login");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/groups/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: groupName,
        ownerId: storedUser.id,
        members: players.map((p) => p.id),   // ← ← ← **החלק הקריטי**
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("Error creating group:", data.error);
      alert("Error creating group.");
      return;
    }

    alert("Group created successfully!");
    navigate("/home");
  } catch (error) {
    console.error("❌ Error creating group:", error);
    alert("Server error.");
  }
};


  return (
    <>
      <NavBar />

      <div className="create-group-container">
        <div className="card create-group-card">
          <h1 className="title">Create New Group</h1>
          <p className="subtitle">Set a name and add players.</p>

          {/* Group Name */}
          <input
            type="text"
            className="input-field"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          {/* Add Player */}
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
                <li key={p.id} className="player-item">
                  {p.username} ({p.email})
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

          {/* Create Group */}
          <button className="btn-primary create-btn" onClick={handleCreateGroup}>
            Create Group
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateGroup;
