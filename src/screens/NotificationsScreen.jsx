import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/Notifications.css";

function NotificationsScreen() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://pokerapp-server.onrender.com";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    async function fetchNotifications() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/notifications/user/${user.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();

        if (data.success) {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error("❌ Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [navigate, API_BASE_URL]);

  // ⭐ Mark single notification
  async function markAsRead(id) {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("❌ Failed to mark notification:", err);
    }
  }

  // ⭐⭐⭐ Mark ALL notifications as read
  async function markAllAsRead() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      await fetch(`${API_BASE_URL}/api/notifications/user/${user.id}/read-all`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      // Update UI instantly
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.error("❌ Failed to mark all notifications:", err);
    }
  }

  // 🟢 Join invitation handler
  async function handleJoinGroup(notification) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      await fetch(`${API_BASE_URL}/api/groups/${notification.meta.groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      await markAsRead(notification.id);

      alert(`You have joined the group "${notification.meta.groupName}".`);
    } catch (err) {
      console.error("❌ Failed to join group:", err);
      alert("Failed to join group. Try again later.");
    }
  }

  // ❌ Decline invitation
  async function handleDecline(notification) {
    await markAsRead(notification.id);
  }

  return (
    <>
      <NavBar />
      <div className="notifications-container">
        <div className="card notifications-card">
          <h1 className="title">Notifications</h1>

          {/* ⭐ Show button only if there are unread notifications */}
          {notifications.some((n) => !n.is_read) && (
            <button className="mark-all-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}

          {loading && <p>Loading...</p>}

          {!loading && notifications.length === 0 && (
            <p className="empty-text">No notifications yet.</p>
          )}

          <ul className="notification-list">
            {notifications.map((n) => {
              const isInvitation = n.meta?.type === "group_invitation";

              return (
                <li
                  key={n.id}
                  className={`notification-item ${
                    n.is_read ? "read" : "unread"
                  }`}
                >
                  {/* ⭐ Special layout for group invitation */}
                  {isInvitation ? (
                    <>
                      <p className="notif-message">
                        <strong>{n.sender_username}</strong> invited you to join
                        the group <strong>"{n.meta.groupName}"</strong>.
                      </p>

                      <div className="invite-actions">
                        <button
                          className="join-btn"
                          onClick={() => handleJoinGroup(n)}
                        >
                          Join Group
                        </button>

                        <button
                          className="decline-btn"
                          onClick={() => handleDecline(n)}
                        >
                          Decline
                        </button>
                      </div>

                      <p className="notif-time">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Default layout for all notifications */}
                      <p className="notif-message">{n.message}</p>
                      <p className="notif-time">
                        {new Date(n.created_at).toLocaleString()}
                      </p>

                      {!n.is_read && (
                        <button
                          className="mark-btn"
                          onClick={() => markAsRead(n.id)}
                        >
                          Mark as read
                        </button>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default NotificationsScreen;
