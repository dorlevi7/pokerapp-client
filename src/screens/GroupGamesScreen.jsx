import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/GroupScreen.css";
import Loader from "../components/Loader";

import { API_BASE_URL } from "../config/api";

function GroupGamesScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);

  /* ============================================================
     LOAD GROUP GAMES + GROUP NAME
  ============================================================ */
  useEffect(() => {
    async function loadData() {
      try {
        /* ------------------ 1️⃣ Load games ------------------ */
        const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}/games`);
        const data = await res.json();

        if (data.success) {
          setGames(data.data);
        }

        /* ------------------ 2️⃣ Load group name ------------------ */
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;

        if (userId) {
          const groupsRes = await fetch(
            `${API_BASE_URL}/api/groups/my-groups`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId }),
            }
          );

          const groupsData = await groupsRes.json();

          if (groupsData.success) {
            const found = groupsData.data.find(
              (g) => g.id === parseInt(groupId)
            );
            if (found) {
              setGroupName(found.name);
            }
          }
        }
      } catch (err) {
        console.error("❌ Error loading group games:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [groupId, API_BASE_URL]);

  /* ============================================================
     LOADING STATE
  ============================================================ */
  if (loading) {
    return (
      <>
        <NavBar />
        <Loader />
      </>
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <>
      <NavBar />

      <div className="group-container">
        <div className="card group-card">
          <h1 className="title">Games History</h1>

          <p className="subtitle">{groupName || `Group #${groupId}`}</p>

          {games.length === 0 ? (
            <p className="empty-text">No games found for this group.</p>
          ) : (
            <ul className="member-list">
              {games.map((game) => (
                <li
                  key={game.id}
                  className={`member-item game-item game-${game.status}`}
                >
                  <div>
                    <strong>Game #{game.game_number}</strong>
                  </div>

                  <div>
                    Type: {game.game_type} | Status: {game.status}
                  </div>

                  <div>
                    Created at:{" "}
                    {new Date(game.created_at).toLocaleString("he-IL", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>

                  <button
                    className="btn-primary"
                    style={{ marginTop: "8px" }}
                    onClick={() =>
                      navigate(`/group/${groupId}/game/${game.id}`)
                    }
                  >
                    View Game
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            className="btn-secondary back-btn"
            onClick={() => navigate(`/group/${groupId}`)}
          >
            ⬅ Back to Group
          </button>
        </div>
      </div>
    </>
  );
}

export default GroupGamesScreen;
