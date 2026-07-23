import client from "./client";

export const listNotifications = () => client.get("/notifications/");

export const fetchUnreadCount = () =>
  client.get("/notifications/unread-count/");

export const markAllNotificationsRead = () =>
  client.post("/notifications/mark-all-read/");
