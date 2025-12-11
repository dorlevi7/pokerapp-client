import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/App.css";
import "../styles/SignupScreen.css";
import { toast } from "react-hot-toast"; // ⭐ NEW

function SignupScreen() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // No need for error/success states anymore
  // const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");

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

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Account created successfully!");

        setTimeout(() => navigate("/login"), 1200);
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("❌ Error during signup:", err);
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="signup-container">
      <div className="card signup-card">
        <h1 className="title">Create Account</h1>
        <p className="subtitle">Join PokerApp today</p>

        <form onSubmit={handleSignup}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />

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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* ❌ Removed old inline error/success messages */}

          <button type="submit" className="btn-primary signup-btn">
            Sign Up
          </button>
        </form>

        <p className="footer-text signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupScreen;
