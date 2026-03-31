// src/services/api/trainingService.js
import apiClient from './apiClient';

export const trainingService = {
  getAll: () => apiClient.get('/training'),
  getById: (id) => apiClient.get(`/training/${id}`),
  create: (data) => apiClient.post('/training', data),
  update: (id, data) => apiClient.put(`/training/${id}`, data),
  delete: (id) => apiClient.delete(`/training/${id}`),
  enroll: (id, userId) => apiClient.post(`/training/${id}/enroll`, { userId }),
  getCompetencyMatrix: () => apiClient.get('/training/competency'),
  getCalendar: () => apiClient.get('/training/calendar'),
  generateCertificate: (id, userId) => apiClient.get(`/training/${id}/certificate/${userId}`),
};

export default trainingService;