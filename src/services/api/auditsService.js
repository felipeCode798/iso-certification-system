// src/services/api/auditsService.js
import apiClient from './apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const auditsService = {
  getAll: () => apiClient.get('/audits'),
  getById: (id) => apiClient.get(`/audits/${id}`),
  create: (data) => apiClient.post('/audits', data),
  update: (id, data) => apiClient.patch(`/audits/${id}`, data),
  delete: (id) => apiClient.delete(`/audits/${id}`),
  getFindings: (auditId) => apiClient.get(`/audits/${auditId}/findings`),
  getChecklist: (auditId) => apiClient.get(`/audits/${auditId}/checklist`),
  getReport: (auditId) => apiClient.get(`/audits/${auditId}/report`),
  addFinding: (auditId, data) => apiClient.post(`/audits/${auditId}/findings`, data),
  saveChecklist: (auditId, checklist) => apiClient.post('/audits/checklist', { auditId, checklist }),
  getStatistics: () => apiClient.get('/audits/statistics'),
};

export const useGetAuditsQuery = () => {
  return useQuery({
    queryKey: ['audits'],
    queryFn: async () => {
      const response = await auditsService.getAll();
      console.log('📡 Auditorías recibidas:', response.data);
      return response.data;
    },
  });
};

export const useGetAuditQuery = (id) => {
  return useQuery({
    queryKey: ['audits', id],
    queryFn: () => auditsService.getById(id),
    enabled: !!id,
  });
};

export const useGetAuditReportQuery = (id) => {
  return useQuery({
    queryKey: ['audits', id, 'report'],
    queryFn: () => auditsService.getReport(id),
    enabled: !!id,
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

export const useUpdateAuditMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => auditsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      queryClient.invalidateQueries({ queryKey: ['audits', id] });
    },
  });
};

export const useDeleteAuditMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => auditsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
    },
  });
};

export const useSaveChecklistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ auditId, checklist }) => auditsService.saveChecklist(auditId, checklist),
    onSuccess: (_, { auditId }) => {
      queryClient.invalidateQueries({ queryKey: ['audits', auditId] });
      queryClient.invalidateQueries({ queryKey: ['audits', auditId, 'checklist'] });
    },
  });
};

export default auditsService;