import client from "./client";

// 교환 약속 확정
export const confirmAppointment = (roomId, meetingPlace) =>
  client.post(`/api/chat-rooms/${roomId}/appointments`, {
    meetingPlace,
  });

// 교환 완료
export const completeAppointment = (appointmentId) =>
  client.patch(`/api/appointments/${appointmentId}/complete`);

// 후기 작성
export const createAppointmentReview = (appointmentId, rating) =>
  client.post(`/api/appointments/${appointmentId}/reviews`, {
    rating,
  });

// 내 약속 조회
export const getMyAppointments = (params = {}) =>
  client.get("/api/appointments/me", { params });
