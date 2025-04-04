import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a function to get the authenticated user's profile
const getUserProfile = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  try {
    const response = await api.get("/api/v1/auth/users/me/", {
      headers: {
        Authorization: `JWT ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Server response:", error.response.data);
      // If the token is invalid or expired, clear it
      if (error.response.status === 401) {
        logout();
      }
    }
    throw error;
  }
};

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

export const authService = { register, login, logout, activate, getUserProfile };