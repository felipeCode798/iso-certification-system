// src/services/auth/authService.js
import apiClient from '../api/apiClient';

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Tu backend devuelve { message, data: { token, user } }
    // El interceptor de apiClient ya normaliza, pero asegurémonos
    let token = null;
    let user = null;
    
    if (response.data?.token) {
      token = response.data.token;
      user = response.data.user;
    } else if (response.data?.data?.token) {
      token = response.data.data.token;
      user = response.data.data.user;
    } else if (response.token) {
      token = response.token;
      user = response.user;
    }
    
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response;
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
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  
  getToken: () => localStorage.getItem('token'),
  
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },
  
  changePassword: async (oldPassword, newPassword) => {
    return await apiClient.post('/auth/change-password', { oldPassword, newPassword });
  },
  
  getProfile: async () => {
    return await apiClient.get('/auth/profile');
  },
};