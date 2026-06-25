import api from "../../api/axios";

export async function listJobs() {
  const { data } = await api.get("/jobs");
  return data.data;
}

export async function createJob(formData) {
  const { data } = await api.post("/jobs", formData);
  return data.data;
}

export async function applyJob(id) {
  return api.post(`/jobs/${id}/apply`);
}

export async function getApplications(id) {
  const { data } = await api.get(`/jobs/${id}/applications`);
  return data.data;
}

export async function markJobAttendance(
  jobId,
  studentId,
  status
) {
  return api.patch(`/jobs/${jobId}/attendance`, {
    studentId,
    status
  });
}

export async function updateApplicationStatus(
  jobId,
  applicationId,
  status
) {
  return api.patch(
    `/jobs/${jobId}/applications/${applicationId}`,
    {
      status
    }
  );
}

export async function deleteJob(id) {
  const res = await api.delete(`/jobs/${id}`);
  return res.data;
}