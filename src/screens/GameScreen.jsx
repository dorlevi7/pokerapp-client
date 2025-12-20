import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/GameScreen.css";
import { toast } from "react-hot-toast"; // ⭐ NEW

function GameScreen() {
  const { groupId, gameId } = useParams();

  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);

  // 🟦 Local rebuy tracking
  const [rebuyCounts, setRebuyCounts] = useState({});
  const [rebuyAmounts, setRebuyAmounts] = useState({});

  // 🟦 Rebuy modal state
  const [rebuyModal, setRebuyModal] = useState({
    open: false,
    playerId: null,
    amount: 0
  });

  // 🟦 Game timer
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

  /* ============================================================
     UPDATE GAME STATUS (start/finish)
  ============================================================ */
  async function updateStatus(newStatus) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/games/${gameId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();

      if (data.success) {
        setGame((prev) => ({ ...prev, status: newStatus }));

        if (newStatus === "active") {
          setElapsedTime(0);
          setTimerRunning(true);
        }

        if (newStatus === "finished") {
          setTimerRunning(false);
          setGame((prev) => ({
            ...prev,
            duration: elapsedTime
          }));
        }
      } else {
        toast.error("Error updating status: " + data.error); // ⭐
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Server error while updating status"); // ⭐
    }
  }

  /* ============================================================
     GAME TIMER EFFECT
  ============================================================ */
  useEffect(() => {
    let interval;

    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerRunning]);

  function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  /* ============================================================
     OPEN REBUY MODAL
  ============================================================ */
  function openRebuyModal(playerId) {
    const settings = game.settings;

    const current = rebuyCounts[playerId] || 0;
    const max = Number(settings.maxRebuysAllowed);

    if (max > 0 && current >= max) {
      toast.error("This player has reached the maximum number of rebuys."); // ⭐
      return;
    }

    let defaultAmount = 0;

    if (settings.rebuyType === "range") {
      defaultAmount = settings.minRebuy;
    }

    if (settings.rebuyType === "percentage") {
      const avg = calculateAverageStack();
      defaultAmount = Math.floor(avg * (settings.rebuyPercent / 100));
    }

    setRebuyModal({
      open: true,
      playerId,
      amount: defaultAmount
    });
  }

  /* ============================================================
     CONFIRM REBUY
  ============================================================ */
  function confirmRebuy() {
    const { playerId, amount } = rebuyModal;
    const settings = game.settings;

    // Validate range
    if (settings.rebuyType === "range") {
      const min = Number(settings.minRebuy);
      const max = Number(settings.maxRebuy);

      if (amount < min || amount > max) {
        toast.error(`Rebuy must be between ${min} and ${max} ${settings.currency}`); // ⭐
        return;
      }
    }

    const current = rebuyCounts[playerId] || 0;
    const maxRebuys = Number(settings.maxRebuysAllowed);

    if (maxRebuys > 0 && current >= maxRebuys) {
      toast.error("Maximum number of rebuys reached."); // ⭐
      return;
    }

    // Apply rebuy
    setRebuyCounts((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1
    }));

    setRebuyAmounts((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + amount
    }));

    toast.success("Rebuy added!"); // ⭐ Nice feedback

    setRebuyModal({ open: false, playerId: null, amount: 0 });
  }

  /* ============================================================
     CALCULATE AVERAGE STACK
  ============================================================ */
  function calculateAverageStack() {
    const start = game.settings.startingChips || 0;
    const totalRebuys = Object.values(rebuyAmounts).reduce((a, b) => a + b, 0);
    return (players.length * start + totalRebuys) / players.length;
  }

  /* ============================================================
     LOAD GAME
  ============================================================ */
  useEffect(() => {
    async function load() {
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

    load();
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

  /* ============================================================
     SUMMARY
  ============================================================ */
  const totalRebuys = Object.values(rebuyCounts).reduce((a, b) => a + b, 0);

  const totalMoneyInTable = players.reduce((sum, p) => {
    const rebuyValue = rebuyAmounts[p.id] || 0;
    return sum + settings.buyIn + rebuyValue;
  }, 0);

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <>
      <NavBar />

      <div className="game-screen-container">
        <div className="game-card">
          <h1 className="title">GAME #{gameId}</h1>

          {game.status === "active" && (
            <div className="game-timer">{formatTime(elapsedTime)}</div>
          )}

          <div className={`status-badge status-${game.status}`}>
            {game.status.toUpperCase()}
          </div>

          {game.status === "pending" && (
            <button className="btn-primary start-btn" onClick={() => updateStatus("active")}>
              Start Game
            </button>
          )}

          {game.status === "active" && (
            <button className="btn-secondary end-btn" onClick={() => updateStatus("finished")}>
              End Game
            </button>
          )}

          <h2 className="section-title">Players</h2>

          <ul className="players-list">
            {players.map((p) => {
              const rebuys = rebuyCounts[p.id] || 0;
              const spent = settings.buyIn + (rebuyAmounts[p.id] || 0);

              const maxAllowed = Number(settings.maxRebuysAllowed);
              const maxReached = maxAllowed > 0 && rebuys >= maxAllowed;

              return (
                <li key={p.id} className="player-item">
                  <div className="player-row">
                    <span className="player-name">{p.username}</span>
                  </div>

                  {game.status === "active" &&
                    settings.gameType === "cash" &&
                    settings.allowRebuy && (
                      <button
                        className={`rebuy-btn ${maxReached ? "maxed" : ""}`}
                        disabled={maxReached}
                        onClick={() => openRebuyModal(p.id)}
                      >
                        {maxReached ? "Maxed" : "+ Rebuy"}
                      </button>
                    )}

                  <div className="player-stats">
                    <p><strong>Buy-in:</strong> {settings.buyIn} {settings.currency}</p>
                    <p><strong>Rebuys:</strong> {rebuys}</p>
                    <p><strong>Total Spent:</strong> {spent} {settings.currency}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <h2 className="section-title">Game Summary</h2>

          <div className="settings-box">
            <p><strong>Players:</strong> {players.length}</p>
            <p><strong>Total Rebuys:</strong> {totalRebuys}</p>
            <p><strong>Total Money in Table:</strong> {totalMoneyInTable} {settings.currency}</p>
            <p><strong>Buy-In:</strong> {settings.buyIn} {settings.currency}</p>

            {game.status === "finished" && game.duration !== undefined && (
              <p><strong>Duration:</strong> {formatTime(game.duration)}</p>
            )}
          </div>

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
                <p><strong>Max Rebuys:</strong> {settings.maxRebuysAllowed}</p>
              </>
            )}

            {settings.gameType === "tournament" && (
              <>
                <p><strong>Starting Chips:</strong> {settings.startingChips}</p>
                <p><strong>Level Duration:</strong> {settings.levelDuration} min</p>
                <p><strong>Blinds:</strong> {settings.startingSB}/{settings.startingBB}</p>
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

      {/* ============================================================
          REBUY MODAL
      ============================================================ */}
      {rebuyModal.open && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Rebuy</h3>

            {settings.rebuyType === "range" && (
              <>
                <p>Select amount:</p>
                <input
                  type="number"
                  className="input"
                  min={settings.minRebuy}
                  max={settings.maxRebuy}
                  value={rebuyModal.amount}
                  onChange={(e) =>
                    setRebuyModal((prev) => ({
                      ...prev,
                      amount: Number(e.target.value)
                    }))
                  }
                />

                <p className="note-small">
                  Allowed range: {settings.minRebuy} – {settings.maxRebuy} {settings.currency}
                </p>
              </>
            )}

            {settings.rebuyType === "percentage" && (
              <p>
                Rebuy Amount: <strong>{rebuyModal.amount} {settings.currency}</strong>
                <br />
                ({settings.rebuyPercent}% of average stack)
              </p>
            )}

            <div className="modal-buttons">
              <button className="btn-primary" onClick={confirmRebuy}>
                Confirm
              </button>

              <button
                className="btn-primary btn-gray"
                onClick={() => setRebuyModal({ open: false, playerId: null, amount: 0 })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GameScreen;
