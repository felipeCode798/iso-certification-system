// src/services/api/nonconformitiesService.js
import apiClient from './apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const nonconformitiesService = {
  getAll: () => apiClient.get('/nonconformities'),
  getById: (id) => apiClient.get(`/nonconformities/${id}`),
  create: (data) => apiClient.post('/nonconformities', data),
  update: (id, data) => apiClient.patch(`/nonconformities/${id}`, data),
  delete: (id) => apiClient.delete(`/nonconformities/${id}`),
  analyze: (id, data) => apiClient.post(`/nonconformities/${id}/analyze`, data),
  close: (id, data) => apiClient.post(`/nonconformities/${id}/close`, data),
  getStatistics: () => apiClient.get('/nonconformities/statistics'),
  getRootCauseAnalysis: (id) => apiClient.get(`/nonconformities/${id}/root-cause`),
  search: (query) => apiClient.get('/nonconformities/search', { params: { q: query } }),
  getBySource: (source) => apiClient.get(`/nonconformities/source/${source}`),
  getBySeverity: (severity) => apiClient.get(`/nonconformities/severity/${severity}`),
  getByStandard: (standard) => apiClient.get(`/nonconformities/standard/${standard}`),
};

// ==================== NC QUERIES ====================
export const useGetNCsQuery = () => {
  return useQuery({
    queryKey: ['nonconformities'],
    queryFn: async () => {
      const response = await nonconformitiesService.getAll();
      console.log('📡 No conformidades recibidas:', response.data);
      return response.data;
    },
  });
};

export const useGetNCQuery = (id) => {
  return useQuery({
    queryKey: ['nonconformities', id],
    queryFn: () => nonconformitiesService.getById(id),
    enabled: !!id,
  });
};

export const useGetNCStatisticsQuery = () => {
  return useQuery({
    queryKey: ['nonconformities', 'statistics'],
    queryFn: async () => {
      const response = await nonconformitiesService.getStatistics();
      return response.data;
    },
  });
};

export const useGetRootCauseAnalysisQuery = (id) => {
  return useQuery({
    queryKey: ['nonconformities', id, 'root-cause'],
    queryFn: () => nonconformitiesService.getRootCauseAnalysis(id),
    enabled: !!id,
  });
};

// ==================== NC MUTATIONS ====================
export const useCreateNCMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => nonconformitiesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nonconformities'] });
      queryClient.invalidateQueries({ queryKey: ['nonconformities', 'statistics'] });
    },
  });
};

export const useUpdateNCMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => nonconformitiesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['nonconformities'] });
      queryClient.invalidateQueries({ queryKey: ['nonconformities', id] });
      queryClient.invalidateQueries({ queryKey: ['nonconformities', 'statistics'] });
    },
  });
};

export const useDeleteNCMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => nonconformitiesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nonconformities'] });
      queryClient.invalidateQueries({ queryKey: ['nonconformities', 'statistics'] });
    },
  });
};

export const useAnalyzeNCMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => nonconformitiesService.analyze(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['nonconformities'] });
      queryClient.invalidateQueries({ queryKey: ['nonconformities', id] });
      queryClient.invalidateQueries({ queryKey: ['nonconformities', id, 'root-cause'] });
      queryClient.invalidateQueries({ queryKey: ['nonconformities', 'statistics'] });
    },
  });
};

export const useCloseNCMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => nonconformitiesService.close(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['nonconformities'] });
      queryClient.invalidateQueries({ queryKey: ['nonconformities', id] });
      queryClient.invalidateQueries({ queryKey: ['nonconformities', 'statistics'] });
    },
  });
};

export default nonconformitiesService;