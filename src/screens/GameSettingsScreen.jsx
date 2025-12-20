import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/GameSettingsScreen.css";

function GameSettingsScreen() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  // ⭐ סוג משחק: Cash Game / Tournament
  const [gameType, setGameType] = useState("cash");

  // ⭐ Buy-in values for both modes
  const [buyIn, setBuyIn] = useState(20);               
  const [tournamentBuyIn, setTournamentBuyIn] = useState(50);

  // ⭐ ריבאיים — Cash Game
  const [allowRebuy, setAllowRebuy] = useState(true);
  const [rebuyType, setRebuyType] = useState("range");
  const [minRebuy, setMinRebuy] = useState(10);
  const [maxRebuy, setMaxRebuy] = useState(25);
  const [rebuyPercent, setRebuyPercent] = useState(100);

  // ⭐ Tournament — Starting Chips & Blinds
  const [startingChips, setStartingChips] = useState(20000);
  const [levelDuration, setLevelDuration] = useState(15);
  const [startingSB, setStartingSB] = useState(100);
  const [startingBB, setStartingBB] = useState(200);

  // ⭐ Table Rules
  const [allowStraddle, setAllowStraddle] = useState(false);
  const [allowRunItTwice, setAllowRunItTwice] = useState(false);

  // ⭐ Late Registration (NEW)
  const [enableLateReg, setEnableLateReg] = useState(false);
  const [lateRegType, setLateRegType] = useState("minutes"); // minutes | level
  const [lateRegMinutes, setLateRegMinutes] = useState(20);
  const [lateRegLevel, setLateRegLevel] = useState(2);

  const [notes, setNotes] = useState("");

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

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
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function startGame() {
    navigate(`/group/${groupId}/game`);
  }

  return (
    <>
      <NavBar />

      <div className="screen-container">
        <div className="card screen-card">
          <h1 className="title">GAME SETTINGS</h1>

          {/* ------------------------ Players ------------------------ */}
          <h2 className="subtitle">Players</h2>

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

          {/* ------------------------ Game Type ------------------------ */}
          <h2 className="subtitle">Game Type</h2>

          <div className="rebuy-container">
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
          </div>

          {/* ------------------------ CASH GAME SETTINGS ------------------------ */}
          {gameType === "cash" && (
            <>
              <h2 className="subtitle">Rebuy Settings</h2>

              <div className="rebuy-container">
                <div className="player-item">
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={allowRebuy}
                      onChange={() => setAllowRebuy((prev) => !prev)}
                    />
                    Allow Rebuy?
                  </label>
                </div>

                {allowRebuy && (
                  <div className="rebuy-inner">

                    <div className="field">
                      <label className="field-label">Rebuy Type</label>
                      <select
                        className="input"
                        value={rebuyType}
                        onChange={(e) => setRebuyType(e.target.value)}
                      >
                        <option value="range">Fixed Range (Min–Max)</option>
                        <option value="percentage">Percentage of Avg Stack</option>
                      </select>
                    </div>

                    {rebuyType === "range" && (
                      <>
                        <div className="field">
                          <label className="field-label">Min Rebuy (₪)</label>
                          <input
                            type="number"
                            className="input"
                            value={minRebuy}
                            min="0"
                            onChange={(e) => setMinRebuy(Number(e.target.value))}
                          />
                        </div>

                        <div className="field">
                          <label className="field-label">Max Rebuy (₪)</label>
                          <input
                            type="number"
                            className="input"
                            value={maxRebuy}
                            min={minRebuy}
                            onChange={(e) => setMaxRebuy(Number(e.target.value))}
                          />
                        </div>
                      </>
                    )}

                    {rebuyType === "percentage" && (
                      <div className="field">
                        <label className="field-label">Rebuy % of Avg Stack</label>
                        <input
                          type="number"
                          className="input"
                          value={rebuyPercent}
                          min="10"
                          max="300"
                          onChange={(e) => setRebuyPercent(Number(e.target.value))}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ------------------------ TOURNAMENT SETTINGS ------------------------ */}
          {gameType === "tournament" && (
            <>
              <h2 className="subtitle">Tournament Settings</h2>

              <div className="rebuy-container">

                <div className="field">
                  <label className="field-label">Starting Chips</label>
                  <input
                    type="number"
                    className="input"
                    value={startingChips}
                    min="1000"
                    onChange={(e) => setStartingChips(Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label className="field-label">Level Duration (minutes)</label>
                  <input
                    type="number"
                    className="input"
                    value={levelDuration}
                    min="5"
                    onChange={(e) => setLevelDuration(Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label className="field-label">Starting Blinds (SB / BB)</label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <input
                      type="number"
                      className="input"
                      value={startingSB}
                      min="1"
                      onChange={(e) => setStartingSB(Number(e.target.value))}
                      placeholder="SB"
                    />
                    <input
                      type="number"
                      className="input"
                      value={startingBB}
                      min="1"
                      onChange={(e) => setStartingBB(Number(e.target.value))}
                      placeholder="BB"
                    />
                  </div>
                </div>

                {/* ---------------- Late Registration ---------------- */}
<div className="player-item late-reg-row">
  <label className="checkbox-row">
    <input
      type="checkbox"
      checked={enableLateReg}
      onChange={() => setEnableLateReg(prev => !prev)}
    />
    Allow Late Registration
  </label>
</div>


                {enableLateReg && (
                  <>
                    <div className="field">
                      <label className="field-label">Late Registration Type</label>
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
                        <label className="field-label">Late Reg Duration (minutes)</label>
                        <input
                          type="number"
                          className="input"
                          value={lateRegMinutes}
                          min="1"
                          onChange={(e) => setLateRegMinutes(Number(e.target.value))}
                        />
                      </div>
                    )}

                    {lateRegType === "level" && (
                      <div className="field">
                        <label className="field-label">Late Reg Until Level</label>
                        <input
                          type="number"
                          className="input"
                          value={lateRegLevel}
                          min="1"
                          onChange={(e) => setLateRegLevel(Number(e.target.value))}
                        />
                      </div>
                    )}
                  </>
                )}

              </div>
            </>
          )}

          {/* ------------------------ SHARED BUY-IN FIELD ------------------------ */}
          <div className="field">
            <label className="field-label">Buy-in Amount (₪)</label>
            <input
              type="number"
              className="input"
              value={gameType === "cash" ? buyIn : tournamentBuyIn}
              min="0"
              onChange={(e) => {
                const val = Number(e.target.value);
                if (gameType === "cash") setBuyIn(val);
                else setTournamentBuyIn(val);
              }}
            />
          </div>

          {/* ------------------------ TABLE RULES ------------------------ */}
          <h2 className="subtitle">Table Rules</h2>

          <div className="rebuy-container">

            <div className="player-item">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={allowStraddle}
                  onChange={() => setAllowStraddle(prev => !prev)}
                />
                Allow Straddle
              </label>
            </div>

            <div className="player-item">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={allowRunItTwice}
                  onChange={() => setAllowRunItTwice(prev => !prev)}
                />
                Allow Run It Twice
              </label>
            </div>

          </div>

          {/* ------------------------ Notes ------------------------ */}
          <div className="field">
            <label className="field-label">Notes</label>
            <textarea
              className="textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes for this game..."
            />
          </div>

          {/* ------------------------ Buttons ------------------------ */}
          <button className="btn-primary action-btn" onClick={startGame}>
            Start Game
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
