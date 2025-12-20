import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/GameScreen.css";

function GameScreen() {
  const { groupId, gameId } = useParams();
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

  useEffect(() => {
    async function loadGame() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/games/${gameId}`);
        const data = await res.json();

        if (data.success) {
          setGame(data.data.game);
          setPlayers(data.data.players);
        }
      } catch (err) {
        console.error("Error loading game:", err);
      }
    }

    loadGame();
  }, [gameId]);

  if (!game) {
    return (
      <>
        <NavBar />
        <div className="game-screen-loading">Loading game...</div>
      </>
    );
  }

  const settings = game.settings || {};

  return (
    <>
      <NavBar />

      <div className="game-screen-container">
        <div className="game-card">
          <h1 className="title">GAME #{gameId}</h1>

          <h2 className="section-title">Players</h2>
          <ul className="players-list">
            {players.map((p) => (
              <li key={p.id} className="player-item">
                {p.username}
              </li>
            ))}
          </ul>

          <h2 className="section-title">Game Settings</h2>
          <div className="settings-box">
            <p><strong>Type:</strong> {settings.gameType}</p>
            <p><strong>Currency:</strong> {settings.currency}</p>
            <p><strong>Buy-In:</strong> {settings.buyIn}</p>

            {settings.gameType === "cash" && (
              <>
                <p><strong>SB:</strong> {settings.cashSB}</p>
                <p><strong>BB:</strong> {settings.cashBB}</p>
                <p><strong>Rebuys Allowed:</strong> {settings.allowRebuy ? "Yes" : "No"}</p>
              </>
            )}

            {settings.gameType === "tournament" && (
              <>
                <p><strong>Starting Chips:</strong> {settings.startingChips}</p>
                <p><strong>Level Duration:</strong> {settings.levelDuration} min</p>
              </>
            )}

            {settings.notes && (
              <>
                <h3 className="section-title">Notes</h3>
                <p>{settings.notes}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GameScreen;
