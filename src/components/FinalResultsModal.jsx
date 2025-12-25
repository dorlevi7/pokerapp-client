import { useNavigate } from "react-router-dom";

function FinalResultsModal({ results, currency, duration, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay">
      <div className="modal-box large">
        <h2>Game Finished 🎉</h2>

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
            {results.map((r) => (
              <tr key={r.userId}>
                <td>{r.username}</td>
                <td>{r.moneyIn} {currency}</td>
                <td>{r.moneyOut} {currency}</td>
                <td className={r.profit >= 0 ? "profit" : "loss"}>
                  {r.profit > 0 && "+"}
                  {r.profit} {currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {duration && (
          <p style={{ marginTop: 12 }}>
            <strong>Duration:</strong> {duration}
          </p>
        )}

        <div className="modal-buttons">
          {/* 🔙 חזרה למסך המשחק */}
          <button
            className="btn-primary btn-blue"
            onClick={onClose}
          >
            Back to Game
          </button>

          {/* 🏠 מעבר לבית */}
          <button
            className="btn-primary"
            onClick={() => navigate("/home")}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinalResultsModal;
