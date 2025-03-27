import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const register = async (userData: {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  re_password: string;
}) => {
  const response = await api.post("/api/v1/auth/users/", userData);
  return response.data;
};

const login = async (userData: { email: string; password: string }) => {
  const response = await api.post("/api/v1/auth/jwt/create/", {
    email: userData.email,
    password: userData.password,
  });
  
  if (response.data) {
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

const activate = async (userData: { uid: string; token: string }) => {
  const response = await api.post("/api/v1/auth/users/activation/", userData);
  return response.data;
};

export const authService = { register, login, logout, activate };