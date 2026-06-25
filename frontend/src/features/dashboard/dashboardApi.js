// src/features/dashboard/dashboardApi.js

import api from "../../api/axios";

export const fetchDeanDashboardApi = () =>
  api.get("/dashboard/dean");

export const fetchCoordinatorDashboardApi = () =>
  api.get("/dashboard/coordinator");

export const fetchStudentDashboardApi = () =>
  api.get("/dashboard/student");

export const fetchInternDashboardApi = () =>
  api.get("/dashboard/intern");