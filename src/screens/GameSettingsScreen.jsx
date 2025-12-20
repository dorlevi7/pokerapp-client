import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/GameSettingsScreen.css";

/* ============================================================
   📌 Accordion Component — clean, minimal, professional
   ============================================================ */
function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false); // ✔ ALL CLOSED by default

  return (
    <div className="accordion-section">
      <button className="accordion-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className="accordion-arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}

/* ============================================================
   📌 MAIN SCREEN
   ============================================================ */
function GameSettingsScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  // ⭐ Game Type
  const [gameType, setGameType] = useState("cash");

  // ⭐ Currency
  const [currency, setCurrency] = useState("₪");

  // ⭐ Buy-in values
  const [buyIn, setBuyIn] = useState(20);
  const [tournamentBuyIn, setTournamentBuyIn] = useState(50);

  // ⭐ Cash Blinds
  const [cashSB, setCashSB] = useState(1);
  const [cashBB, setCashBB] = useState(2);

  // ⭐ Rebuy settings
  const [allowRebuy, setAllowRebuy] = useState(true);
  const [rebuyType, setRebuyType] = useState("range");
  const [minRebuy, setMinRebuy] = useState(10);
  const [maxRebuy, setMaxRebuy] = useState(25);
  const [rebuyPercent, setRebuyPercent] = useState(100);
  const [maxRebuysAllowed, setMaxRebuysAllowed] = useState(5);

  // ⭐ Tournament settings
  const [startingChips, setStartingChips] = useState(20000);
  const [levelDuration, setLevelDuration] = useState(15);
  const [startingSB, setStartingSB] = useState(100);
  const [startingBB, setStartingBB] = useState(200);

  // ⭐ Table Rules
  const [allowStraddle, setAllowStraddle] = useState(false);
  const [allowRunItTwice, setAllowRunItTwice] = useState(false);

  // ⭐ Late Registration
  const [enableLateReg, setEnableLateReg] = useState(false);
  const [lateRegType, setLateRegType] = useState("minutes");
  const [lateRegMinutes, setLateRegMinutes] = useState(20);
  const [lateRegLevel, setLateRegLevel] = useState(2);

  const [notes, setNotes] = useState("");

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

  /* ============================================================
     📌 Fetch Group Members
     ============================================================ */
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

async function startGame() {
  try {
    // ✔ Read the stored user object (like in ProfileScreen)
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const createdBy = storedUser?.id;

    if (!createdBy) {
      alert("User not logged in!");
      return;
    }

    const payload = {
      groupId,
      createdBy,
      playerIds: selectedPlayers,

      settings: {
        gameType,
        currency,
        buyIn: gameType === "cash" ? buyIn : tournamentBuyIn,
        cashSB,
        cashBB,
        allowRebuy,
        rebuyType,
        minRebuy,
        maxRebuy,
        rebuyPercent,
        maxRebuysAllowed,
        startingChips,
        levelDuration,
        startingSB,
        startingBB,
        enableLateReg,
        lateRegType,
        lateRegMinutes,
        lateRegLevel,
        allowStraddle,
        allowRunItTwice,
        notes
      }
    };

    const res = await fetch(`${API_BASE_URL}/api/games/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      alert("Error creating game: " + data.error);
      return;
    }

    const gameId = data.data.gameId;

    navigate(`/group/${groupId}/game/${gameId}`);

  } catch (err) {
    console.error("Error starting game:", err);
    alert("Server error while creating game");
  }
}

  /* ============================================================
     📌 JSX RETURN
     ============================================================ */
  return (
    <>
      <NavBar />

      <div className="screen-container">
        <div className="card screen-card">
          <h1 className="title">GAME SETTINGS</h1>

          {/* ======================================================
              PLAYERS
              ====================================================== */}
          <AccordionSection title="Players">
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
          </AccordionSection>

          {/* ======================================================
              GAME TYPE
              ====================================================== */}
          <AccordionSection title="Game Type">
              <div className="player-item">
                <label className="checkbox-row">
                  <input
                    type="radio"
                    name="gameType"
                    value="cash"
                    checked={gameType === "cash"}
                    onChange={() => setGameType("cash")}
                  />
                  Cash Game
                </label>
              </div>

              <div className="player-item">
                <label className="checkbox-row">
                  <input
                    type="radio"
                    name="gameType"
                    value="tournament"
                    checked={gameType === "tournament"}
                    onChange={() => setGameType("tournament")}
                  />
                  Tournament
                </label>
              </div>
          </AccordionSection>

          {/* ======================================================
              CURRENCY
              ====================================================== */}
          <AccordionSection title="Currency">
            <div className="field">
              <label className="field-label">Select Currency</label>
              <select
                className="input"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="₪">₪ – NIS</option>
                <option value="$">$ – Dollar</option>
                <option value="€">€ – Euro</option>
              </select>
            </div>
          </AccordionSection>

          {/* ======================================================
              CASH GAME SETTINGS
              ====================================================== */}
          {gameType === "cash" && (
            <AccordionSection title="Cash Game Settings">
              {/* Blinds */}
              <div className="field">
                <label className="field-label">Small Blind ({currency})</label>
                <input
                  type="number"
                  className="input"
                  value={cashSB}
                  min="1"
                  onChange={(e) => setCashSB(Number(e.target.value))}
                />
              </div>

              <div className="field">
                <label className="field-label">Big Blind ({currency})</label>
                <input
                  type="number"
                  className="input"
                  value={cashBB}
                  min="1"
                  onChange={(e) => setCashBB(Number(e.target.value))}
                />
              </div>

              {/* Rebuy Settings */}
              <h3 className="subtitle">Rebuy Settings</h3>

              <div className="player-item">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={allowRebuy}
                    onChange={() => setAllowRebuy(!allowRebuy)}
                  />
                  Allow Rebuy?
                </label>
              </div>

              {allowRebuy && (
                <>
                  <div className="field">
                    <label className="field-label">Rebuy Type</label>
                    <select
                      className="input"
                      value={rebuyType}
                      onChange={(e) => setRebuyType(e.target.value)}
                    >
                      <option value="range">Fixed Range</option>
                      <option value="percentage">
                        Percentage of Avg Stack
                      </option>
                    </select>
                  </div>

                  {rebuyType === "range" && (
                    <>
                      <div className="field">
                        <label className="field-label">
                          Min Rebuy ({currency})
                        </label>
                        <input
                          type="number"
                          className="input"
                          value={minRebuy}
                          onChange={(e) =>
                            setMinRebuy(Number(e.target.value))
                          }
                        />
                      </div>

                      <div className="field">
                        <label className="field-label">
                          Max Rebuy ({currency})
                        </label>
                        <input
                          type="number"
                          className="input"
                          value={maxRebuy}
                          onChange={(e) =>
                            setMaxRebuy(Number(e.target.value))
                          }
                        />
                      </div>

                      <div className="field">
                        <label className="field-label">Max Rebuys Allowed</label>
                        <input
                          type="number"
                          className="input"
                          value={maxRebuysAllowed}
                          onChange={(e) =>
                            setMaxRebuysAllowed(Number(e.target.value))
                          }
                        />
                      </div>
                    </>
                  )}

                  {rebuyType === "percentage" && (
                    <div className="field">
                      <label className="field-label">Rebuy %</label>
                      <input
                        type="number"
                        className="input"
                        value={rebuyPercent}
                        min="10"
                        max="300"
                        onChange={(e) =>
                          setRebuyPercent(Number(e.target.value))
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </AccordionSection>
          )}

          {/* ======================================================
              TOURNAMENT SETTINGS
              ====================================================== */}
          {gameType === "tournament" && (
            <AccordionSection title="Tournament Settings">
              <div className="field">
                <label className="field-label">Starting Chips</label>
                <input
                  type="number"
                  className="input"
                  value={startingChips}
                  onChange={(e) =>
                    setStartingChips(Number(e.target.value))
                  }
                />
              </div>

              <div className="field">
                <label className="field-label">Level Duration (minutes)</label>
                <input
                  type="number"
                  className="input"
                  value={levelDuration}
                  onChange={(e) =>
                    setLevelDuration(Number(e.target.value))
                  }
                />
              </div>

              <div className="field">
                <label className="field-label">Starting Blinds</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <input
                    type="number"
                    className="input"
                    value={startingSB}
                    onChange={(e) => setStartingSB(Number(e.target.value))}
                    placeholder="SB"
                  />
                  <input
                    type="number"
                    className="input"
                    value={startingBB}
                    onChange={(e) => setStartingBB(Number(e.target.value))}
                    placeholder="BB"
                  />
                </div>
              </div>

              {/* Late Registration */}
              <h3 className="subtitle">Late Registration</h3>

              <div className="player-item">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={enableLateReg}
                    onChange={() => setEnableLateReg(!enableLateReg)}
                  />
                  Allow Late Registration
                </label>
              </div>

              {enableLateReg && (
                <>
                  <div className="field">
                    <label className="field-label">Late Reg Type</label>
                    <select
                      className="input"
                      value={lateRegType}
                      onChange={(e) => setLateRegType(e.target.value)}
                    >
                      <option value="minutes">By Minutes</option>
                      <option value="level">By Blind Level</option>
                    </select>
                  </div>

                  {lateRegType === "minutes" && (
                    <div className="field">
                      <label className="field-label">Duration (minutes)</label>
                      <input
                        type="number"
                        className="input"
                        value={lateRegMinutes}
                        onChange={(e) =>
                          setLateRegMinutes(Number(e.target.value))
                        }
                      />
                    </div>
                  )}

                  {lateRegType === "level" && (
                    <div className="field">
                      <label className="field-label">Until Level</label>
                      <input
                        type="number"
                        className="input"
                        value={lateRegLevel}
                        onChange={(e) =>
                          setLateRegLevel(Number(e.target.value))
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </AccordionSection>
          )}

          {/* ======================================================
              BUY-IN
              ====================================================== */}
          <AccordionSection title="Buy-In">
            <div className="field">
              <label className="field-label">
                Buy-in Amount ({currency})
              </label>
              <input
                type="number"
                className="input"
                value={gameType === "cash" ? buyIn : tournamentBuyIn}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (gameType === "cash") setBuyIn(v);
                  else setTournamentBuyIn(v);
                }}
              />
            </div>
          </AccordionSection>

          {/* ======================================================
              TABLE RULES (CASH ONLY)
              ====================================================== */}
          {gameType === "cash" && (
            <AccordionSection title="Table Rules">
              <div className="player-item">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={allowStraddle}
                    onChange={() => setAllowStraddle(!allowStraddle)}
                  />
                  Allow Straddle
                </label>
              </div>

              <div className="player-item">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={allowRunItTwice}
                    onChange={() => setAllowRunItTwice(!allowRunItTwice)}
                  />
                  Allow Run It Twice
                </label>
              </div>
            </AccordionSection>
          )}

          {/* ======================================================
              NOTES
              ====================================================== */}
          <AccordionSection title="Notes">
            <div className="field">
              <label className="field-label">Notes</label>
              <textarea
                className="textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes for this game..."
              />
            </div>
          </AccordionSection>

          {/* ======================================================
              BUTTONS
              ====================================================== */}
          <button className="btn-primary action-btn" onClick={startGame}>
            Create Game
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
