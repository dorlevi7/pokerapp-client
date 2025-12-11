import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/ProfileScreen.css";

import NavBar from "../components/NavBar";
import EditProfileModal from "../components/EditProfileModal";
import { toast } from "react-hot-toast"; // ⭐ NEW

function ProfileScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      toast.error("Please log in again");
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  /* --------------------------------------------
     🟢 Save updated user details
  -------------------------------------------- */
  const handleUpdate = async (updatedData) => {
    try {
      const payload = {
        id: user.id,
        ...updatedData,
      };

      const res = await fetch(`${API_BASE_URL}/api/users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error("Failed to update: " + data.error);
        return;
      }

      // Update UI + localStorage
      localStorage.setItem("user", JSON.stringify(data.data));
      setUser(data.data);

      toast.success("Profile updated!");
      setEditOpen(false);

    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Server error. Please try again.");
    }
  };

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
            <button className="btn-primary" onClick={() => setEditOpen(true)}>
              ✏️ Edit Profile
            </button>

            <button
              className="btn-primary btn-blue"
              onClick={() => navigate("/home")}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        onSave={handleUpdate}
      />
    </>
  );
}

export default ProfileScreen;
