// src/services/api/processesService.js
import apiClient from './apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const processesService = {
  getAll: () => apiClient.get('/processes'),
  getById: (id) => apiClient.get(`/processes/${id}`),
  create: (data) => apiClient.post('/processes', data),
  update: (id, data) => apiClient.patch(`/processes/${id}`, data),
  delete: (id) => apiClient.delete(`/processes/${id}`),
  getMetrics: (id) => apiClient.get(`/processes/${id}/metrics`),
  search: (query) => apiClient.get('/processes/search', { params: { q: query } }),
  getStatistics: () => apiClient.get('/processes/statistics'),
};

export const useGetProcessesQuery = () => {
  return useQuery({
    queryKey: ['processes'],
    queryFn: async () => {
      console.log('🔄 Obteniendo procesos del backend...');
      const response = await processesService.getAll();
      console.log('📡 Procesos recibidos:', response.data);
      // Normalizar respuesta
      const processes = response.data?.data || response.data || [];
      return processes;
    },
  });
};

export const useGetProcessMetricsQuery = (processId, options = {}) => {
  return useQuery({
    queryKey: ['processes', processId, 'metrics'],
    queryFn: async () => {
      if (!processId) return null;
      console.log(`🔄 Obteniendo métricas del proceso ${processId}...`);
      const response = await processesService.getMetrics(processId);
      return response.data?.data || response.data;
    },
    enabled: !!processId && options.enabled !== false,
  });
};

export const useCreateProcessMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => processesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
    },
  });
};

export const useUpdateProcessMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => processesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      queryClient.invalidateQueries({ queryKey: ['processes', id, 'metrics'] });
    },
  });
};

export const useDeleteProcessMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => processesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
    },
  });
};

export default processesService;