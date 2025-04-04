import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to inject tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

export default api;