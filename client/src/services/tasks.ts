import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchTasks = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await axios.get(`${API_BASE_URL}/tasks/`, {
    headers: {
      Authorization: `Bearer ${token}`, // Ensure 'Bearer' is used if required by your backend
    },
  });
  return response.data;
};

export const createTask = async (taskData: any) => {
  const response = await axios.post(`${API_BASE_URL}/tasks/`, taskData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return response.data;
};

export const updateTask = async (id: string, taskData: any) => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${id}/`, taskData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return response.data;
};

export const deleteTask = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/tasks/${id}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
};