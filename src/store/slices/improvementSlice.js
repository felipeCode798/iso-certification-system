// src/store/slices/improvementSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import improvementService from '../../services/api/improvementService';

export const fetchActions = createAsyncThunk('improvement/fetchAll', async () => {
  const response = await improvementService.getAllActions();
  return response.data;
});

export const createCorrective = createAsyncThunk('improvement/createCorrective', async (data) => {
  const response = await improvementService.createCorrective(data);
  return response.data;
});

export const createPreventive = createAsyncThunk('improvement/createPreventive', async (data) => {
  const response = await improvementService.createPreventive(data);
  return response.data;
});

const improvementSlice = createSlice({
  name: 'improvement',
  initialState: { actions: [], corrective: [], preventive: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchActions.fulfilled, (state, action) => { state.actions = action.payload; })
      .addCase(createCorrective.fulfilled, (state, action) => { state.corrective.push(action.payload); })
      .addCase(createPreventive.fulfilled, (state, action) => { state.preventive.push(action.payload); });
  },
});

export default improvementSlice.reducer;