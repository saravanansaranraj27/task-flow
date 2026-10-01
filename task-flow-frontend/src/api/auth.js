import { apiRequest, jsonRequest } from "./client";

const API_BASE = "/api/auth";

export const authApi = {
  register: ({ name, email, password }) =>
    apiRequest(
      `${API_BASE}?action=register`,
      jsonRequest("POST", { name, email, password }),
    ),

  login: ({ email, password }) =>
    apiRequest(
      `${API_BASE}?action=login`,
      jsonRequest("POST", { email, password }),
    ),
};
