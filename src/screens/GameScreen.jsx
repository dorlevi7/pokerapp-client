import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/GameScreen.css";
import { toast } from "react-hot-toast"; // ⭐ NEW
import Loader from "../components/Loader";

import EndGameModal from "../components/EndGameModal";

import FinalResultsModal from "../components/FinalResultsModal";

import { API_BASE_URL } from "../config/api";

function GameScreen() {
  const { groupId, gameId } = useParams();

  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);

  // 🟦 Local rebuy tracking
  const [rebuyCounts, setRebuyCounts] = useState({});
  const [rebuyAmounts, setRebuyAmounts] = useState({});

  // 🆕 Group name
  const [groupName, setGroupName] = useState("");

  // 🟥 End game modal
  const [endGameModalOpen, setEndGameModalOpen] = useState(false);

  // 🟩 Final game results (after End Game)
  const [finalResults, setFinalResults] = useState(null);

  const [gameLocked, setGameLocked] = useState(false);

  // 🟦 Rebuy modal state
  const [rebuyModal, setRebuyModal] = useState({
    open: false,
    playerId: null,
    amount: 0,
  });

  // 🟦 Game timer
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // 🟦 Rebuy history (events)
  const [rebuyHistory, setRebuyHistory] = useState([]);

  const [finalResultsModalOpen, setFinalResultsModalOpen] = useState(false);

  const [gameNumberInGroup, setGameNumberInGroup] = useState(null);

  const [loading, setLoading] = useState(true);

  /* ============================================================
     UPDATE GAME STATUS (start/finish)
  ============================================================ */
  async function updateStatus(newStatus) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/games/${gameId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        setGame((prev) => ({ ...prev, status: newStatus }));

        if (newStatus === "active") {
          setTimerRunning(true);
        }

        if (newStatus === "finished") {
          setTimerRunning(false);
        }

        toast.success(
          newStatus === "active" ? "Game started!" : "Game finished!"
        );
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

    // ⛔ Safety check – rebuy not allowed
    if (settings.gameType !== "cash" || settings.allowRebuy !== true) {
      toast.error("Rebuy is not allowed in this game.");
      return;
    }

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
      amount: defaultAmount,
    });
  }

  /* ============================================================
     CONFIRM REBUY
  ============================================================ */
  async function confirmRebuy() {
    const { playerId, amount } = rebuyModal;
    const settings = game.settings;

      if (settings.gameType !== "cash" || settings.allowRebuy !== true) {
        toast.error("Rebuy is not allowed.");
        return;
      }

    // ✅ Validate range
    if (settings.rebuyType === "range") {
      const min = Number(settings.minRebuy);
      const max = Number(settings.maxRebuy);

      if (amount < min || amount > max) {
        toast.error(
          `Rebuy must be between ${min} and ${max} ${settings.currency}`
        );
        return;
      }
    }

    const current = rebuyCounts[playerId] || 0;
    const maxRebuys = Number(settings.maxRebuysAllowed);

    if (maxRebuys > 0 && current >= maxRebuys) {
      toast.error("Maximum number of rebuys reached.");
      return;
    }

    try {
      // 🔥 שליחה לשרת
      const res = await fetch(`${API_BASE_URL}/api/games/${gameId}/rebuy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: playerId,
          amount,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Failed to save rebuy");
        return;
      }

      // 🔥 REALTIME UPDATE — add rebuy event to history
      setRebuyHistory((prev) => [
        ...prev,
        {
          id: data.data.id,
          username:
            players.find((p) => p.id === playerId)?.username || "Player",
          amount,
          secondsFromStart: elapsedTime,
        },
      ]);

      // ✅ עדכון state מקומי רק אחרי הצלחה
      setRebuyCounts((prev) => ({
        ...prev,
        [playerId]: (prev[playerId] || 0) + 1,
      }));

      setRebuyAmounts((prev) => ({
        ...prev,
        [playerId]: (prev[playerId] || 0) + amount,
      }));

      toast.success("Rebuy saved 💰");

      setRebuyModal({ open: false, playerId: null, amount: 0 });
    } catch (err) {
      console.error("Rebuy error:", err);
      toast.error("Server error while saving rebuy");
    }
  }

  /* ============================================================
   END GAME CONFIRM HANDLER (STEP 2)
============================================================ */
  function handleEndGameConfirm(finalStacks) {
    // 🔹 1. Sum final stacks
    const totalFinalChips = Object.values(finalStacks).reduce(
      (sum, chips) => sum + Number(chips),
      0
    );

    const expectedTotal = totalMoneyInTable;

    if (totalFinalChips !== expectedTotal) {
      toast.error(
        `Chip mismatch ❌  
Entered: ${totalFinalChips} ${game.settings.currency}  
Expected: ${expectedTotal} ${game.settings.currency}`
      );
      return;
    }

    // 🔹 2. Calculate results per player
    const results = players.map((player) => {
      const rebuys = rebuyAmounts[player.id] || 0;
      const moneyIn = game.settings.buyIn + rebuys;
      const moneyOut = Number(finalStacks[player.id] || 0);

      return {
        userId: player.id,
        username: player.username,
        moneyIn,
        moneyOut,
        profit: moneyOut - moneyIn,
      };
    });

    setFinalResults(results);

    toast.success("Final stacks validated & results calculated ✔️");

    setGameLocked(true);

    // 🧠 בשלב הזה:
    // results = מוכן ל־DB / סיכום / גרפים

    // ⛔ עדיין לא סוגרים משחק
    setEndGameModalOpen(false);

    // TODO (שלב הבא):
    // saveResultsToServer(results)
    // updateStatus("finished")
  }

  /* ============================================================
   SAVE FINAL RESULTS TO SERVER
============================================================ */
  async function saveResultsToServer(results) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/games/${gameId}/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results,
          durationSeconds: elapsedTime,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Failed to finish game");
        return false;
      }

      return true;
    } catch (err) {
      console.error("Finish game error:", err);
      toast.error("Server error while finishing game");
      return false;
    }
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
        // 🔹 1. Game + players + aggregated rebuys
        const res = await fetch(`${API_BASE_URL}/api/games/${gameId}`);
        const data = await res.json();

        if (data.success) {
          setGame(data.data.game);
          setPlayers(data.data.players);

          const counts = {};
          const amounts = {};

          (data.data.rebuys || []).forEach((r) => {
            counts[r.user_id] = Number(r.count);
            amounts[r.user_id] = Number(r.total);
          });

          setRebuyCounts(counts);
          setRebuyAmounts(amounts);

          // 🔹 1.1 Load final results from DB if game finished
          if (data.data.game.status === "finished") {
            const resultsRes = await fetch(
              `${API_BASE_URL}/api/games/${gameId}/results`
            );
            const resultsData = await resultsRes.json();

            if (resultsData.success) {
              const normalized = resultsData.data.map((r) => ({
                userId: r.user_id,
                username: r.username,
                moneyIn: r.money_in,
                moneyOut: r.money_out,
                profit: r.profit,
              }));

              setFinalResults(normalized);
              setGameLocked(true);
            }
          }
        }

        // 🔹 2. Rebuy history (EVENTS)
        const historyRes = await fetch(
          `${API_BASE_URL}/api/games/${gameId}/rebuys/history`
        );
        const historyData = await historyRes.json();

        if (historyData.success) {
          setRebuyHistory(
            historyData.data.map((r) => ({
              ...r,
              secondsFromStart: Number(r.seconds_from_start),
            }))
          );
        }

        // 🔹 3. Group name (FIXED)
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
            const group = groupsData.data.find((g) => g.id === Number(groupId));

            if (group) {
              setGroupName(group.name);
            }
          }
        }

        // 🔹 4. Calculate game number inside group (DISPLAY ONLY)
        const gamesRes = await fetch(
          `${API_BASE_URL}/api/groups/${groupId}/games`
        );
        const gamesData = await gamesRes.json();

        if (gamesData.success) {
          // סדר כרונולוגי (ישן → חדש)
          const sortedGames = [...gamesData.data].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );

          const index = sortedGames.findIndex((g) => g.id === Number(gameId));

          if (index !== -1) {
            setGameNumberInGroup(index + 1);
          }
        }
      } catch (err) {
        console.error("Error loading game:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [gameId, groupId]);

  /* ============================================================
   INIT TIMER FROM DB (CRITICAL)
============================================================ */
  useEffect(() => {
    if (!game) return;

    if (game.status === "active" && game.started_at) {
      const startedAt = new Date(game.started_at).getTime();
      const now = Date.now();

      const seconds = Math.max(0, Math.floor((now - startedAt) / 1000));

      setElapsedTime(seconds);
      setTimerRunning(true);
    }

    if (game.status === "finished" && game.duration_seconds != null) {
      setElapsedTime(Math.floor(game.duration_seconds));
      setTimerRunning(false);
    }
  }, [game]);

  if (loading) {
    return (
      <>
        <NavBar />
        <Loader />
      </>
    );
  }

  const settings = game.settings || {};

  // ✅ Can rebuy only in active cash games with rebuy enabled
  const canRebuy =
    game.status === "active" &&
    !gameLocked &&
    settings.gameType === "cash" &&
    settings.allowRebuy === true;

    const isRebuyGame =
      settings.gameType === "cash" && settings.allowRebuy === true;

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
          <h1 className="title">GAME #{gameNumberInGroup ?? gameId}</h1>

          <p className="subtitle">{groupName || `Group #${groupId}`}</p>

          {game.status === "active" && (
            <div className="game-timer">{formatTime(elapsedTime)}</div>
          )}

          <div className="status-badges">
            <div className={`status-badge status-${game.status}`}>
              {game.status.toUpperCase()}
            </div>

            {gameLocked && game.status === "active" && (
              <div className="status-badge status-finished">
                FINAL RESULTS READY
              </div>
            )}
          </div>

          {/* ⭐ PRIMARY ACTION – TOP */}
          {gameLocked && game.status === "active" && (
            <div className="top-action-bar">
              <button
                className="btn-primary end-btn"
                onClick={async () => {
                  const success = await saveResultsToServer(finalResults);
                  if (!success) return;

                  toast.success("Game finished & saved ✔️");

                  setGame((prev) => ({
                    ...prev,
                    status: "finished",
                    duration_seconds: elapsedTime,
                  }));

                  setTimerRunning(false);
                  setFinalResultsModalOpen(true);
                }}
              >
                Confirm & Close Game
              </button>
            </div>
          )}

          {game.status === "pending" && (
            <button
              className="btn-primary start-btn"
              onClick={() => updateStatus("active")}
            >
              Start Game
            </button>
          )}

          {game.status === "active" && !gameLocked && (
            <button
              className="btn-secondary end-btn"
              onClick={() => setEndGameModalOpen(true)}
            >
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

                  {canRebuy && (
                    <button
                      className={`rebuy-btn ${maxReached ? "maxed" : ""}`}
                      disabled={maxReached}
                      onClick={() => openRebuyModal(p.id)}
                    >
                      {maxReached ? "Maxed" : "+ Rebuy"}
                    </button>
                  )}

                  <div className="player-stats">
                    <p>
                      <strong>Buy-in:</strong> {settings.buyIn}{" "}
                      {settings.currency}
                    </p>
                    {isRebuyGame && (
                      <p>
                        <strong>Rebuys:</strong> {rebuys}
                      </p>
                    )}

                    <p>
                      <strong>Total Spent:</strong> {spent} {settings.currency}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <h2 className="section-title">Game Summary</h2>

          <div className="settings-box">
            <p>
              <strong>Players:</strong> {players.length}
            </p>
            {isRebuyGame && (
              <p>
                <strong>Total Rebuys:</strong> {totalRebuys}
              </p>
            )}
            <p>
              <strong>Total Money in Table:</strong> {totalMoneyInTable}{" "}
              {settings.currency}
            </p>

            {finalResults && (
              <>
                <h2 className="section-title">Final Results</h2>

                <div className="results-box">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>In</th>
                        <th>Out</th>
                        <th>Profit</th>
                      </tr>
                    </thead>

                    <tbody>
                      {finalResults.map((r) => (
                        <tr key={r.userId}>
                          <td className="player-cell">{r.username}</td>
                          <td>
                            {r.moneyIn} {settings.currency}
                          </td>
                          <td>
                            {r.moneyOut} {settings.currency}
                          </td>
                          <td className={r.profit >= 0 ? "profit" : "loss"}>
                            {r.profit > 0 && "+"}
                            {r.profit} {settings.currency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {game.status === "finished" && game.duration_seconds != null && (
              <p>
                <strong>Duration:</strong>{" "}
                {formatTime(Math.floor(game.duration_seconds))}
              </p>
            )}
          </div>

          {isRebuyGame && (
            <>
              <h2 className="section-title">Rebuy History</h2>

              <div className="rebuy-history-box">
                {rebuyHistory.length === 0 ? (
                  <p className="empty-text">No rebuys yet</p>
                ) : (
                  <ul className="rebuy-history">
                    {rebuyHistory.map((r, index) => (
                      <li key={index} className="rebuy-item">
                        <div className="rebuy-main">
                          <span className="rebuy-user">{r.username}</span>
                          <span className="rebuy-amount">
                            +{r.amount} {settings.currency}
                          </span>
                        </div>

                        <div className="rebuy-time">
                          ⏱ {formatTime(r.secondsFromStart)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          <h2 className="section-title">Game Settings</h2>

          <div className="settings-box">
            <p>
              <strong>Type:</strong> {settings.gameType}
            </p>
            <p>
              <strong>Currency:</strong> {settings.currency}
            </p>
            <p>
              <strong>Buy-In:</strong> {settings.buyIn}
            </p>

            {settings.gameType === "cash" && (
              <>
                <p>
                  <strong>SB:</strong> {settings.cashSB}
                </p>
                <p>
                  <strong>BB:</strong> {settings.cashBB}
                </p>
                <p>
                  <strong>Rebuys Allowed:</strong>{" "}
                  {settings.allowRebuy ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Max Rebuys:</strong> {settings.maxRebuysAllowed}
                </p>
              </>
            )}

            {settings.gameType === "tournament" && (
              <>
                <p>
                  <strong>Starting Chips:</strong> {settings.startingChips}
                </p>
                <p>
                  <strong>Level Duration:</strong> {settings.levelDuration} min
                </p>
                <p>
                  <strong>Blinds:</strong> {settings.startingSB}/
                  {settings.startingBB}
                </p>
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
                      amount: Number(e.target.value),
                    }))
                  }
                />

                <p className="note-small">
                  Allowed range: {settings.minRebuy} – {settings.maxRebuy}{" "}
                  {settings.currency}
                </p>
              </>
            )}

            {settings.rebuyType === "percentage" && (
              <p>
                Rebuy Amount:{" "}
                <strong>
                  {rebuyModal.amount} {settings.currency}
                </strong>
                <br />({settings.rebuyPercent}% of average stack)
              </p>
            )}

            <div className="modal-buttons">
              <button className="btn-primary" onClick={confirmRebuy}>
                Confirm
              </button>

              <button
                className="btn-primary btn-gray"
                onClick={() =>
                  setRebuyModal({ open: false, playerId: null, amount: 0 })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
    END GAME MODAL (STEP 1 – PLACEHOLDER)
============================================================ */}
      {endGameModalOpen && (
        <EndGameModal
          players={players}
          currency={game.settings.currency}
          onClose={() => setEndGameModalOpen(false)}
          onConfirm={handleEndGameConfirm}
        />
      )}

      {finalResultsModalOpen && finalResults && (
        <FinalResultsModal
          results={finalResults}
          currency={settings.currency}
          duration={formatTime(elapsedTime)}
          onClose={() => setFinalResultsModalOpen(false)}
        />
      )}
    </>
  );
}

export default GameScreen;
