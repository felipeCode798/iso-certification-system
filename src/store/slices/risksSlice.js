// src/store/slices/risksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import risksService from '../../services/api/risksService';

export const fetchRisks = createAsyncThunk('risks/fetchAll', async () => {
  const response = await risksService.getAll();
  return response.data;
});

export const createRisk = createAsyncThunk('risks/create', async (data) => {
  const response = await risksService.create(data);
  return response.data;
});

export const updateRisk = createAsyncThunk('risks/update', async ({ id, data }) => {
  const response = await risksService.update(id, data);
  return response.data;
});

export const deleteRisk = createAsyncThunk('risks/delete', async (id) => {
  await risksService.delete(id);
  return id;
});

const risksSlice = createSlice({
  name: 'risks',
  initialState: { risks: [], selectedRisk: null, loading: false, error: null, matrix: null },
  reducers: { setSelectedRisk: (state, action) => { state.selectedRisk = action.payload; } },
  extraReducers: (builder) => {
    builder.addCase(fetchRisks.fulfilled, (state, action) => { state.risks = action.payload; })
      .addCase(createRisk.fulfilled, (state, action) => { state.risks.push(action.payload); })
      .addCase(updateRisk.fulfilled, (state, action) => {
        const index = state.risks.findIndex(r => r.id === action.payload.id);
        if (index !== -1) state.risks[index] = action.payload;
      })
      .addCase(deleteRisk.fulfilled, (state, action) => { state.risks = state.risks.filter(r => r.id !== action.payload); });
  },
});

export const { setSelectedRisk } = risksSlice.actions;
export default risksSlice.reducer;