import { apiRequest, jsonRequest } from "./client";

const API_BASE = "/api/goals";

export const goalApi = {
  getAll: (options) => apiRequest(API_BASE, {}, options),

  create: (goal) => apiRequest(API_BASE, jsonRequest("POST", goal)),

  updateProgress: (id, progress) =>
    apiRequest(API_BASE, jsonRequest("PUT", { id, progress })),

  update: (goal) =>
    apiRequest(
      API_BASE,
      jsonRequest("PUT", {
        id: goal.id,
        title: goal.title.trim(),
        target_date: goal.target_date || "",
        progress: parseInt(goal.progress, 10) || 0,
      }),
    ),

  delete: (id) => apiRequest(`${API_BASE}?id=${id}`, { method: "DELETE" }),
};
