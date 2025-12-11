import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/ProfileScreen.css";
import NavBar from "../components/NavBar";

function ProfileScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <>
      <NavBar />
      <div className="profile-container">
        <div className="card profile-card">
          <h1 className="title">My Profile</h1>
          <p className="subtitle">View and manage your account details</p>

          <div className="profile-info">
            <div className="profile-row">
              <span className="label">First Name:</span>
              <span className="value">{user.first_name}</span>
            </div>
            <div className="profile-row">
              <span className="label">Last Name:</span>
              <span className="value">{user.last_name}</span>
            </div>
            <div className="profile-row">
              <span className="label">Username:</span>
              <span className="value">{user.username}</span>
            </div>
            <div className="profile-row">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button
              className="btn-secondary"
              onClick={() => navigate("/home")}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileScreen;
