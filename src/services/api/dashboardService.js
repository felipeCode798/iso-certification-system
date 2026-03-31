import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockDocuments } from '../../utils/mockData';

// Simulación de storage en memoria
let documentsStore = [...mockDocuments];
let nextId = mockDocuments.length + 1;

const documentationService = {
  getAll: async () => documentsStore,

  getById: async (id) => documentsStore.find(d => d.id === id),

  create: async (data) => {
    const newDoc = { ...data, id: nextId++ };
    documentsStore = [...documentsStore, newDoc];
    return newDoc;
  },

  update: async (id, data) => {
    documentsStore = documentsStore.map(d => d.id === id ? { ...d, ...data } : d);
    return documentsStore.find(d => d.id === id);
  },

  delete: async (id) => {
    documentsStore = documentsStore.filter(d => d.id !== id);
    return id;
  },
};

// ✅ Hooks corregidos — retornan objeto, no array
export const useGetDocumentsQuery = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: documentationService.getAll,
    initialData: mockDocuments,
  });
};

export const useCreateDocumentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => documentationService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
};

export const useUpdateDocumentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => documentationService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
};

export const useDeleteDocumentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => documentationService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
};

export default documentationService;