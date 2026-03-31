import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockProcesses } from '../../utils/mockData';

let processesStore = [...mockProcesses];
let nextId = mockProcesses.length + 1;

const processesService = {
  getAll: async () => processesStore,
  getById: async (id) => processesStore.find(p => p.id === id),
  create: async (data) => {
    const newProcess = { ...data, id: nextId++, effectiveness: 0, efficiency: 0, quality: 0 };
    processesStore = [...processesStore, newProcess];
    return newProcess;
  },
  update: async (id, data) => {
    processesStore = processesStore.map(p => p.id === id ? { ...p, ...data } : p);
    return processesStore.find(p => p.id === id);
  },
  delete: async (id) => {
    processesStore = processesStore.filter(p => p.id !== id);
    return id;
  },
};

export const useGetProcessesQuery = () =>
  useQuery({ queryKey: ['processes'], queryFn: processesService.getAll, initialData: mockProcesses });

export const useCreateProcessMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data) => processesService.create(data), onSuccess: () => qc.invalidateQueries(['processes']) });
};

export const useUpdateProcessMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => processesService.update(id, data), onSuccess: () => qc.invalidateQueries(['processes']) });
};

export const useDeleteProcessMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id) => processesService.delete(id), onSuccess: () => qc.invalidateQueries(['processes']) });
};

export default processesService;