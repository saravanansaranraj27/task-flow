import { apiRequest, jsonRequest } from "./client";

const API_BASE = "/api/tasks";

export const taskApi = {
  getAll: (status, options) => {
    const url = status ? `${API_BASE}?status=${status}` : API_BASE;
    return apiRequest(url, {}, options);
  },

  create: (task) => apiRequest(API_BASE, jsonRequest("POST", task)),

  delete: (id) => apiRequest(`${API_BASE}?id=${id}`, { method: "DELETE" }),

  replace: async (id, task) => {
    await taskApi.delete(id);
    return taskApi.create(task);
  },
};
