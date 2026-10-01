import { apiRequest, jsonRequest } from "./client";

const API_BASE = "/api/notes";

export const noteApi = {
  getAll: (options) => apiRequest(API_BASE, {}, options),

  create: (note) => apiRequest(API_BASE, jsonRequest("POST", note)),

  delete: (id) => apiRequest(`${API_BASE}?id=${id}`, { method: "DELETE" }),

  replace: async (id, note) => {
    await noteApi.delete(id);
    return noteApi.create(note);
  },
};
