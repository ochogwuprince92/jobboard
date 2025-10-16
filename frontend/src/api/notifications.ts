import axiosClient from "./axiosClient";
import type { Notification } from "@/types";

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await axiosClient.get("/notifications/");
  return response.data;
};

export const markAsRead = async (id: number) => {
  const response = await axiosClient.patch(`/notifications/${id}/`, { is_read: true });
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await axiosClient.post("/notifications/mark-all-read/");
  return response.data;
};
