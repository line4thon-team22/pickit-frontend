import client from "./client";

export const getMyAppointments = (params = {}) => {
  return client.get("/api/appointments/me", { params });
};
