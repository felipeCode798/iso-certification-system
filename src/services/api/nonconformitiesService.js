// src/services/api/nonconformitiesService.js
import apiClient from './apiClient';

export const nonconformitiesService = {
  getAll: () => apiClient.get('/nonconformities'),
  getById: (id) => apiClient.get(`/nonconformities/${id}`),
  create: (data) => apiClient.post('/nonconformities', data),
  update: (id, data) => apiClient.put(`/nonconformities/${id}`, data),
  delete: (id) => apiClient.delete(`/nonconformities/${id}`),
  analyze: (id, analysis) => apiClient.post(`/nonconformities/${id}/analyze`, analysis),
  close: (id, closure) => apiClient.post(`/nonconformities/${id}/close`, closure),
  getRootCauseAnalysis: (id) => apiClient.get(`/nonconformities/${id}/root-cause`),
  getBySource: (source) => apiClient.get('/nonconformities', { params: { source } }),
};

export default nonconformitiesService;