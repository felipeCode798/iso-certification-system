// src/services/api/dashboardService.js
import apiClient from './apiClient';
import { useQuery } from '@tanstack/react-query';

export const dashboardService = {
  getDashboard: () => apiClient.get('/dashboard'),
  getStatistics: () => apiClient.get('/dashboard/statistics'),
};

export const useGetDashboardQuery = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await dashboardService.getDashboard();
      return response.data?.data || response.data;
    },
  });
};

export const useGetStatisticsQuery = () => {
  return useQuery({
    queryKey: ['dashboard-statistics'],
    queryFn: async () => {
      const response = await dashboardService.getStatistics();
      return response.data?.data || response.data;
    },
  });
};

export default dashboardService;