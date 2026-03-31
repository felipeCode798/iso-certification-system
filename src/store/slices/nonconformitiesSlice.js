// src/store/slices/nonconformitiesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import nonconformitiesService from '../../services/api/nonconformitiesService';

export const fetchNCs = createAsyncThunk('nonconformities/fetchAll', async () => {
  const response = await nonconformitiesService.getAll();
  return response.data;
});

export const createNC = createAsyncThunk('nonconformities/create', async (data) => {
  const response = await nonconformitiesService.create(data);
  return response.data;
});

export const closeNC = createAsyncThunk('nonconformities/close', async ({ id, closure }) => {
  const response = await nonconformitiesService.close(id, closure);
  return response.data;
});

const nonconformitiesSlice = createSlice({
  name: 'nonconformities',
  initialState: { ncs: [], selectedNC: null, loading: false, error: null },
  reducers: { setSelectedNC: (state, action) => { state.selectedNC = action.payload; } },
  extraReducers: (builder) => {
    builder.addCase(fetchNCs.fulfilled, (state, action) => { state.ncs = action.payload; })
      .addCase(createNC.fulfilled, (state, action) => { state.ncs.push(action.payload); })
      .addCase(closeNC.fulfilled, (state, action) => {
        const index = state.ncs.findIndex(nc => nc.id === action.payload.id);
        if (index !== -1) state.ncs[index] = action.payload;
      });
  },
});

export const { setSelectedNC } = nonconformitiesSlice.actions;
export default nonconformitiesSlice.reducer;