// src/services/api/indicatorsService.js
import apiClient from './apiClient';

export const indicatorsService = {
  getAll: () => apiClient.get('/indicators'),
  getById: (id) => apiClient.get(`/indicators/${id}`),
  create: (data) => apiClient.post('/indicators', data),
  update: (id, data) => apiClient.put(`/indicators/${id}`, data),
  delete: (id) => apiClient.delete(`/indicators/${id}`),
  getValue: (id) => apiClient.get(`/indicators/${id}/value`),
  getDashboard: () => apiClient.get('/indicators/dashboard'),
  getTrends: (id, period) => apiClient.get(`/indicators/${id}/trends`, { params: { period } }),
  exportData: (format) => apiClient.get('/indicators/export', { params: { format } }),
};

export default indicatorsService;