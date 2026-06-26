// boutique-frontend/lib/auth.js
// Authentication helpers for managing user session

import apiClient from './api';

// Login user
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/api/auth/login.php', {
      email,
      password,
    });

    if (response.data.success) {
      // Store token and user data
      localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_KEY, response.data.data.token);
      localStorage.setItem(process.env.NEXT_PUBLIC_USER_KEY, JSON.stringify(response.data.data.user));
      return { success: true, user: response.data.data.user };
    }

    return { success: false, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// Register user
export const register = async (name, email, password) => {
  try {
    const response = await apiClient.post('/api/auth/register.php', {
      name,
      email,
      password,
    });

    if (response.data.success) {
      return { success: true, message: response.data.message };
    }

    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
  localStorage.removeItem(process.env.NEXT_PUBLIC_USER_KEY);
  // Optional: Call logout endpoint
  // apiClient.post('/api/auth/logout.php');
};

// Get current logged in user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(process.env.NEXT_PUBLIC_USER_KEY);
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Get token
export const getToken = () => {
  return localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getToken();
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

// Check if user is customer
export const isCustomer = () => {
  const user = getCurrentUser();
  return user?.role === 'customer';
};
