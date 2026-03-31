// src/store/slices/indicatorsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import indicatorsService from '../../services/api/indicatorsService';

export const fetchIndicators = createAsyncThunk('indicators/fetchAll', async () => {
  const response = await indicatorsService.getAll();
  return response.data;
});

export const createIndicator = createAsyncThunk('indicators/create', async (data) => {
  const response = await indicatorsService.create(data);
  return response.data;
});

export const fetchDashboard = createAsyncThunk('indicators/fetchDashboard', async () => {
  const response = await indicatorsService.getDashboard();
  return response.data;
});

const indicatorsSlice = createSlice({
  name: 'indicators',
  initialState: { indicators: [], dashboard: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIndicators.fulfilled, (state, action) => { state.indicators = action.payload; })
      .addCase(createIndicator.fulfilled, (state, action) => { state.indicators.push(action.payload); })
      .addCase(fetchDashboard.fulfilled, (state, action) => { state.dashboard = action.payload; });
  },
});

export default indicatorsSlice.reducer;