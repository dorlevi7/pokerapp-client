import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/GroupScreen.css";
import Loader from "../components/Loader";

function GroupGamesScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

  /* ============================================================
     LOAD GROUP GAMES
  ============================================================ */
  useEffect(() => {
    async function loadGames() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/groups/${groupId}/games`
        );
        const data = await res.json();

        if (data.success) {
          setGames(data.data);
        }
      } catch (err) {
        console.error("❌ Error loading group games:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
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

          <p className="subtitle">Group ID: {groupId}</p>

          {games.length === 0 ? (
            <p className="empty-text">No games found for this group.</p>
          ) : (
            <ul className="member-list">
              {games.map((game) => (
                <li key={game.id} className="member-item">
                  <div>
                    <strong>Game #{game.id}</strong>
                  </div>

                  <div>
                    Type: {game.game_type} | Status: {game.status}
                  </div>

<div>
  Created at:{" "}
  {new Date(game.created_at).toLocaleString("he-IL", {
    dateStyle: "short",
    timeStyle: "short"
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
