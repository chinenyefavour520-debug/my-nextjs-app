import axios from 'axios';

// Get the backend URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired or invalid — log user out
    if (error.response?.status === 401) {
      localStorage.removeItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
      localStorage.removeItem(process.env.NEXT_PUBLIC_USER_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
