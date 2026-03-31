// src/store/slices/processesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import processesService from '../../services/api/processesService';

export const fetchProcesses = createAsyncThunk('processes/fetchAll', async () => {
  const response = await processesService.getAll();
  return response.data;
});

export const createProcess = createAsyncThunk('processes/create', async (data) => {
  const response = await processesService.create(data);
  return response.data;
});

export const updateProcess = createAsyncThunk('processes/update', async ({ id, data }) => {
  const response = await processesService.update(id, data);
  return response.data;
});

export const deleteProcess = createAsyncThunk('processes/delete', async (id) => {
  await processesService.delete(id);
  return id;
});

const processesSlice = createSlice({
  name: 'processes',
  initialState: { processes: [], selectedProcess: null, loading: false, error: null },
  reducers: { setSelectedProcess: (state, action) => { state.selectedProcess = action.payload; } },
  extraReducers: (builder) => {
    builder.addCase(fetchProcesses.fulfilled, (state, action) => { state.processes = action.payload; })
      .addCase(createProcess.fulfilled, (state, action) => { state.processes.push(action.payload); })
      .addCase(updateProcess.fulfilled, (state, action) => {
        const index = state.processes.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.processes[index] = action.payload;
      })
      .addCase(deleteProcess.fulfilled, (state, action) => { state.processes = state.processes.filter(p => p.id !== action.payload); });
  },
});

export const { setSelectedProcess } = processesSlice.actions;
export default processesSlice.reducer;