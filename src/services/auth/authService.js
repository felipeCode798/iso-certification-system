// src/services/auth/authService.js
import apiClient from '../api/apiClient';

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  getToken: () => localStorage.getItem('token'),
  
  isAuthenticated: () => !!localStorage.getItem('token'),
  
  changePassword: async (oldPassword, newPassword) => {
    return await apiClient.post('/auth/change-password', { oldPassword, newPassword });
  },
  
  getProfile: async () => {
    return await apiClient.get('/auth/profile');
  },
};

export default authService;