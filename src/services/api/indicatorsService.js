// src/services/api/indicatorsService.js
import apiClient from './apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const indicatorsService = {
  getAll: () => apiClient.get('/indicators'),
  getById: (id) => apiClient.get(`/indicators/${id}`),
  create: (data) => apiClient.post('/indicators', data),
  update: (id, data) => apiClient.patch(`/indicators/${id}`, data),
  delete: (id) => apiClient.delete(`/indicators/${id}`),
  getDashboard: () => apiClient.get('/indicators/dashboard'),
  getStatistics: () => apiClient.get('/indicators/statistics'),
  getTrends: (id, months) => apiClient.get(`/indicators/${id}/trends`, { params: { months } }),
  getValues: (id, period) => apiClient.get(`/indicators/${id}/values`, { params: { period } }),
  recordValue: (id, data) => apiClient.post(`/indicators/${id}/values`, data),
  exportData: (format) => apiClient.get('/indicators/export', { params: { format } }),
};

// ==================== KPI QUERIES ====================
export const useGetKPIsQuery = () => {
  return useQuery({
    queryKey: ['indicators'],
    queryFn: async () => {
      const response = await indicatorsService.getAll();
      console.log('📡 KPIs recibidos:', response.data);
      return response.data;
    },
  });
};

export const useGetKPIQuery = (id) => {
  return useQuery({
    queryKey: ['indicators', id],
    queryFn: () => indicatorsService.getById(id),
    enabled: !!id,
  });
};

export const useGetDashboardQuery = () => {
  return useQuery({
    queryKey: ['indicators', 'dashboard'],
    queryFn: async () => {
      const response = await indicatorsService.getDashboard();
      return response.data;
    },
  });
};

export const useGetStatisticsQuery = () => {
  return useQuery({
    queryKey: ['indicators', 'statistics'],
    queryFn: async () => {
      const response = await indicatorsService.getStatistics();
      return response.data;
    },
  });
};

export const useGetTrendsQuery = (kpiId, months = 6) => {
  return useQuery({
    queryKey: ['indicators', kpiId, 'trends', months],
    queryFn: () => indicatorsService.getTrends(kpiId, months),
    enabled: !!kpiId,
  });
};

// ==================== KPI MUTATIONS ====================
export const useCreateKPIMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => indicatorsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicators'] });
      queryClient.invalidateQueries({ queryKey: ['indicators', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['indicators', 'statistics'] });
    },
  });
};

export const useUpdateKPIMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => indicatorsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['indicators'] });
      queryClient.invalidateQueries({ queryKey: ['indicators', id] });
      queryClient.invalidateQueries({ queryKey: ['indicators', 'dashboard'] });
    },
  });
};

export const useDeleteKPIMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => indicatorsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicators'] });
      queryClient.invalidateQueries({ queryKey: ['indicators', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['indicators', 'statistics'] });
    },
  });
};

export const useRecordKPIValueMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => indicatorsService.recordValue(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['indicators', id] });
      queryClient.invalidateQueries({ queryKey: ['indicators', id, 'trends'] });
      queryClient.invalidateQueries({ queryKey: ['indicators', 'dashboard'] });
    },
  });
};

export default indicatorsService;