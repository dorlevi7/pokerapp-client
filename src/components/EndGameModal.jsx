import React, { useState } from "react";
import { toast } from "react-hot-toast";

function EndGameModal({ players, currency, onClose, onConfirm }) {
  const [finalStacks, setFinalStacks] = useState(() => {
    const initial = {};
    players.forEach(p => {
      initial[p.id] = "";
    });
    return initial;
  });

  function handleChange(playerId, value) {
    setFinalStacks(prev => ({
      ...prev,
      [playerId]: value
    }));
  }

  function handleConfirm() {
    // basic validation
    for (const val of Object.values(finalStacks)) {
      if (val === "" || Number(val) < 0) {
        toast.error("Please enter valid chip amounts for all players");
        return;
      }
    }

    onConfirm(
      Object.fromEntries(
        Object.entries(finalStacks).map(([k, v]) => [k, Number(v)])
      )
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>End Game – Final Chips</h3>

        <div className="endgame-list">
          {players.map(p => (
            <div key={p.id} className="endgame-row">
              <span className="endgame-name">{p.username}</span>

              <input
                type="number"
                className="input"
                placeholder="Final chips"
                value={finalStacks[p.id]}
                onChange={e => handleChange(p.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="modal-buttons">
          <button className="btn-primary" onClick={handleConfirm}>
            Confirm & Finish
          </button>

          <button className="btn-primary btn-gray" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndGameModal;
