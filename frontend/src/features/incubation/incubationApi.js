import api from "../../api/axios";

export const submitIdeaApi = (body) =>
  api.post("/incubation", body);

export const fetchMyIdeasApi = () =>
  api.get("/incubation/my");

export const fetchCoordinatorIdeasApi = () =>
  api.get("/incubation/coordinator");

export const fetchDeanIdeasApi = () =>
  api.get("/incubation/dean");

export const fetchIdeaDetailsApi = (id) =>
  api.get(`/incubation/${id}`);

export const coordinatorApproveApi = (id, body) =>
  api.patch(`/incubation/${id}/coordinator-approve`, body);

export const coordinatorRejectApi = (id, body) =>
  api.patch(`/incubation/${id}/coordinator-reject`, body);

export const deanApproveApi = (id, body) =>
  api.patch(`/incubation/${id}/dean-approve`, body);

export const deanRejectApi = (id, body) =>
  api.patch(`/incubation/${id}/dean-reject`, body);