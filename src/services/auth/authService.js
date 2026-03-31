// src/services/auth/authService.js
import apiClient from '../api/apiClient';

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  changePassword: async (oldPassword, newPassword) => {
    return await apiClient.post('/auth/change-password', { oldPassword, newPassword });
  },
  
  resetPassword: async (email) => {
    return await apiClient.post('/auth/reset-password', { email });
  },
};

export default authService;