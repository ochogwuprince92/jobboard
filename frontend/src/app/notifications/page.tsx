"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/hooks/useAuth";

export default function NotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>Notifications</h1>
      {notifications.length === 0 && <p>No notifications yet.</p>}
      <ul>
        {notifications.map((n, i) => (
          <li key={i} style={{ padding: "8px 0", borderBottom: "1px solid #ddd" }}>
            <strong>{n.title}</strong>
            <p>{n.message}</p>
            <small>{new Date(n.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
