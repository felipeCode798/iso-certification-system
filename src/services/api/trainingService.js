// src/services/api/trainingService.js
import apiClient from './apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const trainingService = {
  getAll: () => apiClient.get('/training'),
  getById: (id) => apiClient.get(`/training/${id}`),
  create: (data) => apiClient.post('/training', data),
  update: (id, data) => apiClient.patch(`/training/${id}`, data),
  delete: (id) => apiClient.delete(`/training/${id}`),
  enroll: (id, userId) => apiClient.post(`/training/${id}/enroll`, { userId }),
  getStatistics: () => apiClient.get('/training/statistics'),
  getCalendar: (start, end) => apiClient.get('/training/calendar', { params: { start, end } }),
  getCompetencyMatrix: () => apiClient.get('/training/competencies/matrix'),
  getCompetencyGaps: (target) => apiClient.get('/training/competencies/gaps', { params: { target } }),
};

// ==================== TRAINING QUERIES ====================
export const useGetTrainingsQuery = () => {
  return useQuery({
    queryKey: ['trainings'],
    queryFn: async () => {
      const response = await trainingService.getAll();
      console.log('📡 Capacitaciones recibidas:', response.data);
      return response.data;
    },
  });
};

export const useGetTrainingQuery = (id) => {
  return useQuery({
    queryKey: ['trainings', id],
    queryFn: () => trainingService.getById(id),
    enabled: !!id,
  });
};

export const useGetTrainingStatisticsQuery = () => {
  return useQuery({
    queryKey: ['trainings', 'statistics'],
    queryFn: async () => {
      const response = await trainingService.getStatistics();
      return response.data;
    },
  });
};

// ==================== TRAINING MUTATIONS ====================
export const useCreateTrainingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => trainingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      queryClient.invalidateQueries({ queryKey: ['trainings', 'statistics'] });
    },
  });
};

export const useUpdateTrainingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => trainingService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      queryClient.invalidateQueries({ queryKey: ['trainings', id] });
      queryClient.invalidateQueries({ queryKey: ['trainings', 'statistics'] });
    },
  });
};

export const useDeleteTrainingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => trainingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      queryClient.invalidateQueries({ queryKey: ['trainings', 'statistics'] });
    },
  });
};

export const useEnrollTrainingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }) => trainingService.enroll(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
    },
  });
};

// ==================== COMPETENCY QUERIES ====================
export const useGetCompetencyMatrixQuery = () => {
  return useQuery({
    queryKey: ['competencies', 'matrix'],
    queryFn: async () => {
      const response = await trainingService.getCompetencyMatrix();
      return response.data;
    },
  });
};

export const useGetCompetencyGapsQuery = (target = 80) => {
  return useQuery({
    queryKey: ['competencies', 'gaps', target],
    queryFn: () => trainingService.getCompetencyGaps(target),
  });
};

export default trainingService;