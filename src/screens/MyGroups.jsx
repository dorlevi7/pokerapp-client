import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { toast } from "react-hot-toast";
import "../styles/MyGroups.css";

import Loader from "../components/Loader";

import { API_BASE_URL } from "../config/api";

function MyGroups() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     LOAD USER GROUPS
  ============================================================ */
  useEffect(() => {
    const fetchGroups = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      if (!userId) {
        toast.error("User not found. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/groups/my-groups`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          toast.error(data.error || "Failed to load groups.");
          return;
        }

        setGroups(data.data || []);
      } catch (err) {
        console.error("❌ Error fetching groups:", err);
        toast.error("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [navigate]);

  /* ============================================================
     LOADING STATE
  ============================================================ */
  if (loading) {
    return (
      <>
        <NavBar />
        <Loader />
      </>
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <>
      <NavBar />

      <div className="groups-container">
        <div className="card groups-card">
          <h1 className="title">My Groups</h1>
          <p className="subtitle">Groups you are a member of:</p>

          {groups.length === 0 && (
            <p className="empty-text">You are not in any groups yet.</p>
          )}

          {groups.length > 0 && (
            <ul className="groups-list">
              {groups.map((g) => (
                <li key={g.id} className="group-item">
                  <div className="group-info">
                    <span className="group-name">{g.name}</span>

                    {g.owner_username && (
                      <small className="group-owner">
                        (Owner: {g.owner_username})
                      </small>
                    )}

                    {!g.owner_username && g.owner_first_name && (
                      <small className="group-owner">
                        (Owner: {g.owner_first_name} {g.owner_last_name || ""})
                      </small>
                    )}
                  </div>

                  <button
                    className="btn-primary small-btn"
                    onClick={() => navigate(`/group/${g.id}`)}
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            className="btn-secondary back-btn"
            onClick={() => navigate("/home")}
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </>
  );
}

export default MyGroups;
