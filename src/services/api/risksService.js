import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockRisks } from '../../utils/mockData';

let risksStore = [...mockRisks];
let nextId = mockRisks.length + 1;

const risksService = {
  getAll:  async ()         => risksStore,
  getById: async (id)       => risksStore.find(r => r.id === id),
  create:  async (data)     => { const r = { ...data, id: nextId++ }; risksStore = [...risksStore, r]; return r; },
  update:  async (id, data) => { risksStore = risksStore.map(r => r.id === id ? { ...r, ...data } : r); return risksStore.find(r => r.id === id); },
  delete:  async (id)       => { risksStore = risksStore.filter(r => r.id !== id); return id; },
};

export const useGetRisksQuery = () =>
  useQuery({ queryKey: ['risks'], queryFn: risksService.getAll, initialData: mockRisks });

export const useCreateRiskMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data) => risksService.create(data), onSuccess: () => qc.invalidateQueries(['risks']) });
};

export const useUpdateRiskMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => risksService.update(id, data), onSuccess: () => qc.invalidateQueries(['risks']) });
};

export const useDeleteRiskMutation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id) => risksService.delete(id), onSuccess: () => qc.invalidateQueries(['risks']) });
};

export default risksService;