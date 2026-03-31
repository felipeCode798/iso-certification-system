// src/store/slices/incidentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import incidentsService from '../../services/api/incidentsService';

export const fetchIncidents = createAsyncThunk('incidents/fetchAll', async () => {
  const response = await incidentsService.getAll();
  return response.data;
});

export const createIncident = createAsyncThunk('incidents/create', async (data) => {
  const response = await incidentsService.create(data);
  return response.data;
});

export const resolveIncident = createAsyncThunk('incidents/resolve', async ({ id, resolution }) => {
  const response = await incidentsService.resolve(id, resolution);
  return response.data;
});

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState: { incidents: [], selectedIncident: null, loading: false, error: null },
  reducers: { setSelectedIncident: (state, action) => { state.selectedIncident = action.payload; } },
  extraReducers: (builder) => {
    builder.addCase(fetchIncidents.fulfilled, (state, action) => { state.incidents = action.payload; })
      .addCase(createIncident.fulfilled, (state, action) => { state.incidents.push(action.payload); })
      .addCase(resolveIncident.fulfilled, (state, action) => {
        const index = state.incidents.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.incidents[index] = action.payload;
      });
  },
});

export const { setSelectedIncident } = incidentsSlice.actions;
export default incidentsSlice.reducer;