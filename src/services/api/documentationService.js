// src/services/api/documentationService.js
import apiClient from './apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const documentationService = {
  getAll: () => apiClient.get('/documents'),
  getById: (id) => apiClient.get(`/documents/${id}`),
  create: (data) => apiClient.post('/documents', data),
  update: (id, data) => apiClient.put(`/documents/${id}`, data),
  delete: (id) => apiClient.delete(`/documents/${id}`),
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/documents/upload', formData);
  },
  getVersions: (id) => apiClient.get(`/documents/${id}/versions`),
  approve: (id) => apiClient.post(`/documents/${id}/approve`),
  reject: (id, reason) => apiClient.post(`/documents/${id}/reject`, { reason }),
  search: (query) => apiClient.get('/documents/search', { params: { q: query } }),
};

// Hooks para React Query
export const useGetDocumentsQuery = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => documentationService.getAll(),
  });
};

export const useCreateDocumentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => documentationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useUpdateDocumentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => documentationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useDeleteDocumentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => documentationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export default documentationService;