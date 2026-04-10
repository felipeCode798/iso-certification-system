// src/services/api/risksService.js
import apiClient from './apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const risksService = {
  getAll: () => apiClient.get('/risks'),
  getById: (id) => apiClient.get(`/risks/${id}`),
  create: (data) => apiClient.post('/risks', data),
  update: (id, data) => apiClient.patch(`/risks/${id}`, data),
  delete: (id) => apiClient.delete(`/risks/${id}`),
  assess: (id, data) => apiClient.post(`/risks/${id}/assess`, data),
  mitigate: (id, mitigationPlan, deadline) => apiClient.post(`/risks/${id}/mitigate`, { mitigationPlan, deadline }),
  getStatistics: () => apiClient.get('/risks/statistics'),
  getMatrix: () => apiClient.get('/risks/matrix'),
  getHeatmap: () => apiClient.get('/risks/heatmap'),
  getRegister: () => apiClient.get('/risks/register'),
  search: (query) => apiClient.get('/risks/search', { params: { q: query } }),
  getByCategory: (category) => apiClient.get(`/risks/category/${category}`),
  getByStandard: (standard) => apiClient.get(`/risks/standard/${standard}`),
};

export const useGetRisksQuery = () => {
  return useQuery({
    queryKey: ['risks'],
    queryFn: async () => {
      console.log('🔄 Obteniendo riesgos del backend...');
      const response = await risksService.getAll();
      console.log('📡 Riesgos recibidos:', response.data);
      // Normalizar respuesta
      const risks = response.data?.data || response.data || [];
      return risks;
    },
  });
};

export const useGetRiskQuery = (id) => {
  return useQuery({
    queryKey: ['risks', id],
    queryFn: () => risksService.getById(id),
    enabled: !!id,
  });
};

export const useGetRiskStatisticsQuery = () => {
  return useQuery({
    queryKey: ['risks', 'statistics'],
    queryFn: async () => {
      const response = await risksService.getStatistics();
      return response.data?.data || response.data;
    },
  });
};

export const useGetRiskMatrixQuery = () => {
  return useQuery({
    queryKey: ['risks', 'matrix'],
    queryFn: async () => {
      const response = await risksService.getMatrix();
      return response.data?.data || response.data;
    },
  });
};

export const useCreateRiskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => risksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks'] });
      queryClient.invalidateQueries({ queryKey: ['risks', 'statistics'] });
      queryClient.invalidateQueries({ queryKey: ['risks', 'matrix'] });
    },
  });
};

export const useUpdateRiskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => risksService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['risks'] });
      queryClient.invalidateQueries({ queryKey: ['risks', id] });
      queryClient.invalidateQueries({ queryKey: ['risks', 'statistics'] });
      queryClient.invalidateQueries({ queryKey: ['risks', 'matrix'] });
    },
  });
};

export const useDeleteRiskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => risksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks'] });
      queryClient.invalidateQueries({ queryKey: ['risks', 'statistics'] });
      queryClient.invalidateQueries({ queryKey: ['risks', 'matrix'] });
    },
  });
};

export const useAssessRiskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => risksService.assess(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['risks'] });
      queryClient.invalidateQueries({ queryKey: ['risks', id] });
      queryClient.invalidateQueries({ queryKey: ['risks', 'statistics'] });
      queryClient.invalidateQueries({ queryKey: ['risks', 'matrix'] });
    },
  });
};

export default risksService;