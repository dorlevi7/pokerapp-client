import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { toast } from "react-hot-toast";
import "../styles/Notifications.css";

import Loader from "../components/Loader";

import { API_BASE_URL } from "../config/api";

function NotificationsScreen() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     LOAD NOTIFICATIONS
  ============================================================ */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

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
        } else {
          toast.error("Failed to load notifications.");
        }
      } catch (err) {
        console.error("❌ Failed to load notifications:", err);
        toast.error("Server error, please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [navigate, API_BASE_URL]);

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
     ACTIONS
  ============================================================ */
  async function markAsRead(id) {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      toast.success("Notification marked as read");
    } catch (err) {
      console.error("❌ Failed to mark notification:", err);
      toast.error("Failed to update notification.");
    }
  }

  async function markAllAsRead() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      await fetch(
        `${API_BASE_URL}/api/notifications/user/${user.id}/read-all`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("❌ Failed to mark all notifications:", err);
      toast.error("Failed to update notifications.");
    }
  }

  async function handleJoinGroup(notification) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/groups/${notification.meta.groupId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Failed to join group.");
        return;
      }

      await markAsRead(notification.id);
      toast.success(`Joined group "${notification.meta.groupName}"`);
    } catch (err) {
      console.error("❌ Failed to join group:", err);
      toast.error("Failed to join group. Try again later.");
    }
  }

  async function handleDecline(notification) {
    await markAsRead(notification.id);
    toast("Invitation dismissed");
  }

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <>
      <NavBar />

      <div className="notifications-container">
        <div className="card notifications-card">
          <h1 className="title">Notifications</h1>

          {notifications.some((n) => !n.is_read) && (
            <button className="mark-all-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}

          {notifications.length === 0 && (
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
