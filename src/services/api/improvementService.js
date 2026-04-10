// src/services/api/improvementService.js
import apiClient from './apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const improvementService = {
  // Action Plan
  getAllActions: () => apiClient.get('/improvement/actions'),
  getActionById: (id) => apiClient.get(`/improvement/actions/${id}`),
  createAction: (data) => apiClient.post('/improvement/actions', data),
  updateAction: (id, data) => apiClient.patch(`/improvement/actions/${id}`, data),
  deleteAction: (id) => apiClient.delete(`/improvement/actions/${id}`),
  
  // Corrective Actions
  getAllCorrective: () => apiClient.get('/improvement/corrective'),
  getCorrectiveById: (id) => apiClient.get(`/improvement/corrective/${id}`),
  createCorrective: (data) => apiClient.post('/improvement/corrective', data),
  updateCorrective: (id, data) => apiClient.patch(`/improvement/corrective/${id}`, data),
  verifyCorrective: (id, data) => apiClient.post(`/improvement/corrective/${id}/verify`, data),
  deleteCorrective: (id) => apiClient.delete(`/improvement/corrective/${id}`),
  
  // Preventive Actions
  getAllPreventive: () => apiClient.get('/improvement/preventive'),
  getPreventiveById: (id) => apiClient.get(`/improvement/preventive/${id}`),
  createPreventive: (data) => apiClient.post('/improvement/preventive', data),
  updatePreventive: (id, data) => apiClient.patch(`/improvement/preventive/${id}`, data),
  deletePreventive: (id) => apiClient.delete(`/improvement/preventive/${id}`),
  
  // Statistics
  getStatistics: () => apiClient.get('/improvement/statistics'),
  getPDCAStatus: () => apiClient.get('/improvement/pdca/status'),
};

// ==================== ACTION PLAN QUERIES ====================
export const useGetActionPlansQuery = () => {
  return useQuery({
    queryKey: ['improvement', 'actions'],
    queryFn: async () => {
      const response = await improvementService.getAllActions();
      console.log('📡 Planes de acción:', response.data);
      return response.data;
    },
  });
};

// ==================== CORRECTIVE ACTIONS QUERIES ====================
export const useGetCorrectiveActionsQuery = () => {
  return useQuery({
    queryKey: ['improvement', 'corrective'],
    queryFn: async () => {
      const response = await improvementService.getAllCorrective();
      console.log('📡 Acciones correctivas:', response.data);
      return response.data;
    },
  });
};

// ==================== PREVENTIVE ACTIONS QUERIES ====================
export const useGetPreventiveActionsQuery = () => {
  return useQuery({
    queryKey: ['improvement', 'preventive'],
    queryFn: async () => {
      const response = await improvementService.getAllPreventive();
      console.log('📡 Acciones preventivas:', response.data);
      return response.data;
    },
  });
};

// ==================== STATISTICS QUERIES ====================
export const useGetImprovementStatisticsQuery = () => {
  return useQuery({
    queryKey: ['improvement', 'statistics'],
    queryFn: async () => {
      const response = await improvementService.getStatistics();
      return response.data;
    },
  });
};

// ==================== MUTATIONS ====================
export const useCreateActionPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => improvementService.createAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['improvement', 'actions'] });
      queryClient.invalidateQueries({ queryKey: ['improvement', 'statistics'] });
    },
  });
};

export const useUpdateActionPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => improvementService.updateAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['improvement', 'actions'] });
      queryClient.invalidateQueries({ queryKey: ['improvement', 'statistics'] });
    },
  });
};

export const useCreateCorrectiveActionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => improvementService.createCorrective(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['improvement', 'corrective'] });
      queryClient.invalidateQueries({ queryKey: ['improvement', 'statistics'] });
    },
  });
};

export const useVerifyCorrectiveActionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => improvementService.verifyCorrective(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['improvement', 'corrective'] });
      queryClient.invalidateQueries({ queryKey: ['improvement', 'statistics'] });
    },
  });
};

export const useCreatePreventiveActionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => improvementService.createPreventive(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['improvement', 'preventive'] });
      queryClient.invalidateQueries({ queryKey: ['improvement', 'statistics'] });
    },
  });
};

export default improvementService;