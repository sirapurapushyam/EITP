import api from "../../api/axios";

/**
 * Get all announcements visible to logged-in user
 */
export function getAnnouncementsApi() {
  return api.get("/announcements");
}

/**
 * Create announcement
 */
export function createAnnouncementApi(payload) {
  return api.post("/announcements", payload);
}

/**
 * Dismiss announcement
 * (Remove only for current user)
 */
export function dismissAnnouncementApi(id) {
  return api.patch(`/announcements/${id}/dismiss`);
}

/**
 * Delete announcement
 * (Only sender can delete)
 */
export function deleteAnnouncementApi(id) {
  return api.delete(`/announcements/${id}`);
}