// src/services/api/auditsService.js
import apiClient from './apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const auditsService = {
  getAll: () => apiClient.get('/audits'),
  getById: (id) => apiClient.get(`/audits/${id}`),
  create: (data) => apiClient.post('/audits', data),
  update: (id, data) => apiClient.put(`/audits/${id}`, data),
  delete: (id) => apiClient.delete(`/audits/${id}`),
  getFindings: (auditId) => apiClient.get(`/audits/${auditId}/findings`),
  addFinding: (auditId, data) => apiClient.post(`/audits/${auditId}/findings`, data),
  generateReport: (auditId) => apiClient.get(`/audits/${auditId}/report`),
  scheduleAudit: (data) => apiClient.post('/audits/schedule', data),
};

export const useGetAuditsQuery = () => {
  return useQuery({
    queryKey: ['audits'],
    queryFn: () => auditsService.getAll(),
  });
};

export const useCreateAuditMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => auditsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
    },
  });
};

export default auditsService;