// src/screens/LoginScreen.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/App.css"; // עיצוב כללי
import "../styles/LoginScreen.css"; // עיצוב למסך הספציפי

function LoginScreen() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔗 נשתמש באותו URL כמו ב־Signup
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🧠 התחברות אמיתית לשרת
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        // נשמור token בלוקאל סטורג׳ לשימוש עתידי
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", formData.email);
        navigate("/home");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("❌ Error logging in:", err);
      setError("Server error. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h1 className="title">PokerApp</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="footer-text login-footer">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;
