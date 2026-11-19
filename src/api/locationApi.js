import client from "./client";

export const previewLocation = (location) =>
  client.post("/api/popup-verifications/preview", location);

export const verifyLocation = (location) =>
  client.post("/api/popup-verifications", location);

export const getLocationStatus = () => client.get("/api/me/location-status");

export const getCurrentVerifications = () =>
  client.get("/api/me/popup-verifications");

export const updateLocation = (location) =>
  client.patch("/api/me/location", location);
