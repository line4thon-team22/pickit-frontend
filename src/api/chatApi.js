import client from "./client";

export const getChatRooms = (params = {}) =>
  client.get("/api/chat-rooms", { params });
