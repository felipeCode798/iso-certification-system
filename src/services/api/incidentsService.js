// src/services/api/incidentsService.js
import apiClient from './apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const incidentsService = {
  getAll: () => apiClient.get('/incidents'),
  getById: (id) => apiClient.get(`/incidents/${id}`),
  create: (data) => apiClient.post('/incidents', data),
  update: (id, data) => apiClient.patch(`/incidents/${id}`, data),
  delete: (id) => apiClient.delete(`/incidents/${id}`),
  resolve: (id, resolution) => apiClient.post(`/incidents/${id}/resolve`, resolution),
  getStatistics: () => apiClient.get('/incidents/statistics'),
  search: (query) => apiClient.get('/incidents/search', { params: { q: query } }),
  getBySeverity: (severity) => apiClient.get(`/incidents/severity/${severity}`),
};

export const useGetIncidentsQuery = () => {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      const response = await incidentsService.getAll();
      console.log('📡 Incidentes recibidos:', response.data);
      // Normalizar la respuesta
      const incidents = response.data?.data || response.data || [];
      return incidents;
    },
  });
};

export const useCreateIncidentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => incidentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};

export const useUpdateIncidentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => incidentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};

export const useResolveIncidentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolution }) => incidentsService.resolve(id, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};

export const useDeleteIncidentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => incidentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};

export const useIncidentStatisticsQuery = () => {
  return useQuery({
    queryKey: ['incidents', 'statistics'],
    queryFn: async () => {
      const response = await incidentsService.getStatistics();
      return response.data?.data || response.data;
    },
  });
};

export default incidentsService;