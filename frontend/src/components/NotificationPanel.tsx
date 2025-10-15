"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/api";

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  userRole: "seeker" | "employer";
}

export default function NotificationPanel({ userRole }: NotificationPanelProps) {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", userRole],
    queryFn: async () => {
      const res = await api.get(`/notifications/?role=${userRole}`);
      return res.data;
    },
    refetchInterval: 10000, // every 10s
  });

  if (isLoading) return <div>Loading notifications...</div>;

  return (
    <div style={{
      position: "fixed",
      top: 10,
      right: 10,
      background: "#e8ffe8",
      padding: "10px",
      borderRadius: "8px",
      width: "250px",
      maxHeight: "400px",
      overflowY: "auto"
    }}>
      <strong>Notifications</strong>
      <ul>
        {notifications.length === 0 && <li>No notifications</li>}
        {notifications.map((n: Notification) => (
          <li key={n.id}>
            <p>{n.message}</p>
            <small>{new Date(n.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
