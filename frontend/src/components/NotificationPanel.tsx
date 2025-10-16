"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/api/notifications";
import type { Notification } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function NotificationPanel() {
  const { isAuthenticated } = useAuth();
  
  const { data: notifications = [], isLoading, isError } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 30000, // poll every 30s
    enabled: isAuthenticated, // only fetch if authenticated
  });

  if (!isAuthenticated || isLoading) return null;
  if (isError) return null;

  return (
    <div style={{
      position: "fixed",
      top: 80,
      right: 10,
      background: "white",
      padding: "10px",
      borderRadius: "8px",
      width: "250px",
      maxHeight: "400px",
      overflowY: "auto",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e0e0e0"
    }}>
      <strong>Notifications</strong>
      <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0 0" }}>
        {notifications.length === 0 && <li style={{ color: "#999" }}>No notifications</li>}
        {notifications.map((n) => (
          <li key={n.id} style={{ 
            padding: "8px", 
            borderBottom: "1px solid #f0f0f0",
            background: n.is_read ? "transparent" : "#f0f3ff"
          }}>
            <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem" }}>{n.message}</p>
            <small style={{ color: "#999" }}>{new Date(n.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
