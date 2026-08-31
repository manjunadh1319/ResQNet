import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Something went wrong while talking to the server.";
    return Promise.reject(new Error(message));
  }
);

export const emergencyApi = {
  create: (payload) => api.post("/emergency", payload).then((r) => r.data),
  getHistory: (skip = 0, limit = 100) =>
    api.get("/history", { params: { skip, limit } }).then((r) => r.data),
  getById: (id) => api.get(`/emergency/${id}`).then((r) => r.data),
  remove: (id) => api.delete(`/emergency/${id}`).then((r) => r.data),
  getStats: () => api.get("/stats").then((r) => r.data),
  getMapData: () => api.get("/map-data").then((r) => r.data),
};

export default api;
