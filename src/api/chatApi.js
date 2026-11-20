import client from "./client";

export const getChatRooms = (params = {}) =>
  client.get("/api/chat-rooms", { params });

export const getChatRoomDetail = (roomId) =>
  client.get(`/api/chat-rooms/${roomId}`);

export const getChatMessages = (roomId, params = {}) =>
  client.get(`/api/chat-rooms/${roomId}/messages`, { params });
