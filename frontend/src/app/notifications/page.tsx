"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getNotifications } from "@/api/notifications";
import type { Notification } from "@/types";
import Loading from "@/components/common/Loading";

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();

  const { data: notifications = [], isLoading, error } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: isAuthenticated,
  });

  if (isLoading) return <Loading fullScreen message="Loading notifications..." />;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "1rem" }}>
      <h1>Notifications</h1>
      {error && <p style={{ color: "red" }}>Error loading notifications</p>}
      {notifications.length === 0 && <p>No notifications yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.map((n) => (
          <li 
            key={n.id} 
            style={{ 
              padding: "1rem", 
              borderBottom: "1px solid #ddd",
              background: n.is_read ? "transparent" : "#f0f3ff",
              borderRadius: "4px",
              marginBottom: "0.5rem"
            }}
          >
            <p style={{ margin: "0 0 0.5rem 0", fontWeight: 500 }}>{n.message}</p>
            <small style={{ color: "#666" }}>
              {new Date(n.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
