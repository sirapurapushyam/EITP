import api from "../../api/axios";

export async function listEvents() {
  const response = await api.get("/events");

  console.log("Events API response:", response.data);

  return Array.isArray(response.data.data)
    ? response.data.data
    : [];
}

export async function createEvent(formData) {
  const { data } = await api.post("/events", formData);
  return data.data;
}

export async function registerEvent(id) {
  return api.post(`/events/${id}/register`);
}

export async function getRegistrations(id) {
  const { data } = await api.get(`/events/${id}/registrations`);
  return data.data;
}

export async function markAttendance(eventId, studentId, status) {
  return api.patch(`/events/${eventId}/attendance`, {
    studentId,
    status
  });
}
export async function deleteEvent(id) {
  const res = await api.delete(`/events/${id}`);
  return res.data;
}