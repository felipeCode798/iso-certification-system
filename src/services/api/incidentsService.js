import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockIncidents } from '../../utils/mockData';
import dayjs from 'dayjs';

let incidentsStore = [...mockIncidents];
let nextId = mockIncidents.length + 1;

const incidentsService = {
  getAll:   async ()              => incidentsStore,
  getById:  async (id)            => incidentsStore.find(i => i.id === id),
  create:   async (data)          => {
    const inc = { ...data, id: nextId++, progress: 0, status: 'open',
      assignedDate: null, analysisDate: null, resolutionDate: null };
    incidentsStore = [...incidentsStore, inc];
    return inc;
  },
  update:   async (id, data)      => {
    incidentsStore = incidentsStore.map(i => i.id === id ? { ...i, ...data } : i);
    return incidentsStore.find(i => i.id === id);
  },
  resolve:  async (id, resolution) => {
    const updated = { ...incidentsStore.find(i => i.id === id), ...resolution,
      status: 'resolved', progress: 100, resolutionDate: dayjs().format('YYYY-MM-DD HH:mm') };
    incidentsStore = incidentsStore.map(i => i.id === id ? updated : i);
    return updated;
  },
  delete:   async (id)            => { incidentsStore = incidentsStore.filter(i => i.id !== id); return id; },
};

export const useGetIncidentsQuery = () =>
  useQuery({ queryKey: ['incidents'], queryFn: incidentsService.getAll, initialData: mockIncidents });

export const useCreateIncidentMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data) => incidentsService.create(data), onSuccess: () => qc.invalidateQueries(['incidents']) });
};

export const useUpdateIncidentMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => incidentsService.update(id, data), onSuccess: () => qc.invalidateQueries(['incidents']) });
};

export const useResolveIncidentMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, resolution }) => incidentsService.resolve(id, resolution), onSuccess: () => qc.invalidateQueries(['incidents']) });
};

export const useDeleteIncidentMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id) => incidentsService.delete(id), onSuccess: () => qc.invalidateQueries(['incidents']) });
};

export default incidentsService;