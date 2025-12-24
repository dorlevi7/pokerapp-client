import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/CreateGroup.css";
import { toast } from "react-hot-toast";

function CreateGroup() {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [playerInput, setPlayerInput] = useState("");
  const [players, setPlayers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

  /* ============================================================
     🟢 Add Player
     ============================================================ */
  const addPlayer = async () => {
    const trimmed = playerInput.trim();
    if (!trimmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/exists?query=${encodeURIComponent(trimmed)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error("Server error while checking user.");
        return;
      }

      if (!data.exists) {
        toast.error("No user found with that email or username.");
        return;
      }

      const user = data.user;

      if (players.find((p) => p.id === user.id)) {
        toast.error("This user is already in the list.");
        return;
      }

      setPlayers((prev) => [...prev, user]);
      setPlayerInput("");
      toast.success(`Added ${user.username}`);
    } catch (err) {
      console.error("Error checking user:", err);
      toast.error("Server error. Please try again later.");
    }
  };

  /* ============================================================
     ❌ Remove Player
     ============================================================ */
  const removePlayer = (index) => {
    const removed = players[index];
    setPlayers((prev) => prev.filter((_, i) => i !== index));
    toast("Removed " + removed.username, { icon: "👤" });
  };

  /* ============================================================
     🟢 Create Group
     ============================================================ */
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name.");
      return;
    }

    if (players.length === 0) {
      toast.error("Please add at least one player.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const ownerId = user?.id;

    if (!ownerId) {
      toast.error("User not logged in.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1️⃣ Create group
      const response = await fetch(`${API_BASE_URL}/api/groups/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupName,
          ownerId,
          memberIds: players.map((p) => p.id),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error || "Failed to create group.");
        return;
      }

      const group = data.data;

      // 2️⃣ Send invitations
      const receiverIds = players
        .map((p) => p.id)
        .filter((id) => id !== ownerId);

      if (receiverIds.length > 0) {
        await fetch(`${API_BASE_URL}/api/notifications/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: ownerId,
            receiverIds,
            title: "Group Invitation",
            message: `You have been invited to join the group "${groupName}".`,
            meta: {
              type: "group_invitation",
              groupId: group.id,
              groupName,
              inviterId: ownerId,
            },
          }),
        });
      }

      toast.success("Group created! Invitations sent.");
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      console.error("❌ Error creating group:", err);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================================================
     RENDER
     ============================================================ */
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
            disabled={isSubmitting}
          />

          {/* Add Player */}
          <div className="player-input-row">
            <input
              type="text"
              className="input-field"
              placeholder="Player email or username"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              disabled={isSubmitting}
            />

            <button
              className="btn-primary small-btn"
              onClick={addPlayer}
              disabled={isSubmitting}
            >
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
                    disabled={isSubmitting}
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Create Group */}
          <button
            className="btn-primary create-btn"
            onClick={handleCreateGroup}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Group"}
          </button>

                    <button
            className="btn-secondary back-btn"
            onClick={() => navigate("/home")}
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateGroup;
