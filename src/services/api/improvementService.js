// src/services/api/improvementService.js
import apiClient from './apiClient';

export const improvementService = {
  getAllActions: () => apiClient.get('/improvement/actions'),
  getCorrective: () => apiClient.get('/improvement/corrective'),
  getPreventive: () => apiClient.get('/improvement/preventive'),
  createCorrective: (data) => apiClient.post('/improvement/corrective', data),
  createPreventive: (data) => apiClient.post('/improvement/preventive', data),
  updateAction: (id, data) => apiClient.put(`/improvement/actions/${id}`, data),
  verifyEffectiveness: (id, data) => apiClient.post(`/improvement/actions/${id}/verify`, data),
  getImprovementPlan: () => apiClient.get('/improvement/plan'),
  getPDCAStatus: () => apiClient.get('/improvement/pdca'),
};

export default improvementService;