import React from "react";
import "./App.css";

function App() {
  const [time, setTime] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [clicks, setClicks] = React.useState([]);
  const [debugLogs, setDebugLogs] = React.useState([]); // 🪄 On-screen logs

// ✅ Automatically detect environment (local vs. production)
const SERVER_URL = "https://pokerapp-server.onrender.com";
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000" // local dev
    : SERVER_URL; // production (Render)


  // 🕒 Save current time (POST)
  const handleUpdateTime = async () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("he-IL", { hour12: false });
    setTime(timeString);

    try {
      const response = await fetch(`${API_BASE_URL}/api/clicks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Time saved to database successfully!");
      } else {
        setMessage("⚠️ Failed to save time to database.");
      }
    } catch (error) {
      console.error("Error sending click to server:", error);
      setMessage("❌ Server error while saving time.");
    }
  };

  // 📅 Fetch saved times (GET)
  const handleGetClicks = async () => {
    try {
      const url = `${API_BASE_URL}/api/clicks`;
      setDebugLogs((prev) => [...prev, `📡 Fetching clicks from: ${url}`]);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      setDebugLogs((prev) => [...prev, `🌍 Response status: ${response.status}`]);

      const text = await response.text();
      setDebugLogs((prev) => [...prev, `🧾 Raw response text: ${text}`]);

      const data = JSON.parse(text);
      setDebugLogs((prev) => [...prev, `✅ Parsed JSON successfully`]);

      if (data.success) {
        setClicks(data.data);
      } else {
        setMessage("⚠️ Failed to fetch click times.");
      }
    } catch (error) {
      console.error("❌ Error fetching clicks:", error);
      setDebugLogs((prev) => [...prev, `❌ Error: ${error.message}`]);
      setMessage("❌ Server error while fetching data.");
    }
  };

  return (
    <div className="app-root">
      <div className="app-card">
        <h1 className="app-title">PokerApp</h1>
        <p className="app-subtitle">
          Simple test screen — desktop and mobile supported.
        </p>

        <button className="app-button" onClick={handleUpdateTime}>
          Save current time
        </button>

        <button className="app-button" onClick={handleGetClicks}>
          Show saved times
        </button>

        {time && <p className="app-time">Current device time: {time}</p>}
        {message && <p className="app-message">{message}</p>}

        {clicks.length > 0 && (
          <div className="app-clicks">
            <h3>🕒 Last saved times:</h3>
            <ul>
              {clicks.map((click) => (
                <li key={click.id}>
                  {new Date(click.clicked_at).toLocaleString("he-IL")}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 🧩 Debug overlay (for mobile without console) */}
        <div
          style={{
            background: "#111",
            color: "#0f0",
            padding: "10px",
            marginTop: "20px",
            fontFamily: "monospace",
            fontSize: "12px",
            borderRadius: "8px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <h4>📋 Debug log:</h4>
          {debugLogs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
