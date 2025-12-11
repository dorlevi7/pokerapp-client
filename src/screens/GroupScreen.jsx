import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/GroupScreen.css";
import { toast } from "react-hot-toast"; // ⭐ NEW

function GroupScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [ownerId, setOwnerId] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        /* ---------------------- 1️⃣ Fetch Members ---------------------- */
        const membersRes = await fetch(
          `${API_BASE_URL}/api/groups/${groupId}/members`
        );
        const membersData = await membersRes.json();

        if (!membersRes.ok || !membersData.success) {
          toast.error("Failed to load group members.");
          setLoading(false);
          return;
        }

        setMembers(membersData.data);

        /* ---------------------- 2️⃣ Fetch Group Info ---------------------- */
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;

        const groupsRes = await fetch(`${API_BASE_URL}/api/groups/my-groups`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const groupsData = await groupsRes.json();

        if (groupsRes.ok && groupsData.success) {
          const found = groupsData.data.find(
            (g) => g.id === parseInt(groupId)
          );

          if (found) {
            setGroupName(found.name);
            setOwnerId(found.owner_id);

            const owner = membersData.data.find(
              (m) => m.id === found.owner_id
            );

            if (owner) setOwnerName(owner.username);
          }
        }
      } catch (error) {
        console.error("❌ Error loading group screen:", error);
        toast.error("Server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId, API_BASE_URL]);

  return (
    <>
      <NavBar />

      <div className="group-container">
        <div className="card group-card">
          <h1 className="title">{groupName || "Group"}</h1>

          {ownerName && <p className="subtitle">Owner: {ownerName}</p>}

          {loading && <p>Loading group...</p>}

          {!loading && (
            <>
              <h2 className="subtitle">Members</h2>

              {members.length === 0 && (
                <p className="empty-text">No members found.</p>
              )}

              {members.length > 0 && (
                <ul className="member-list">
                  {members.map((m) => (
                    <li key={m.id} className="member-item">
                      {m.username} ({m.email})
                    </li>
                  ))}
                </ul>
              )}

              <button
                className="btn-primary start-btn"
                onClick={() => toast("Game screen coming soon!", { icon: "🎮" })}
              >
                Start Game
              </button>

              <button
                className="btn-secondary back-btn"
                onClick={() => navigate("/my-groups")}
              >
                ⬅ Back
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default GroupScreen;
