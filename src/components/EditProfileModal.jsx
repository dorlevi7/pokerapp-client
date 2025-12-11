import React, { useState } from "react";
import "../styles/EditProfileModal.css";

function EditProfileModal({ isOpen, onClose, user, onSave }) {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    email: user.email,
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <>
      {/* Background blur overlay */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* Actual modal card */}
      <div className="modal-card">
        <h2>Edit Profile</h2>

        <div className="modal-row">
          <label>First Name:</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            type="text"
          />
        </div>

        <div className="modal-row">
          <label>Last Name:</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            type="text"
          />
        </div>

        <div className="modal-row">
          <label>Username:</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            type="text"
          />
        </div>

        <div className="modal-row">
          <label>Email:</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
          />
        </div>

        <div className="modal-row">
          <label>New Password:</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Leave empty to keep current"
          />
        </div>

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="modal-btn save" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

export default EditProfileModal;
