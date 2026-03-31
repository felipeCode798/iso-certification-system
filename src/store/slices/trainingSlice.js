// src/store/slices/trainingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import trainingService from '../../services/api/trainingService';

export const fetchTrainings = createAsyncThunk('training/fetchAll', async () => {
  const response = await trainingService.getAll();
  return response.data;
});

export const createTraining = createAsyncThunk('training/create', async (data) => {
  const response = await trainingService.create(data);
  return response.data;
});

export const enrollTraining = createAsyncThunk('training/enroll', async ({ id, userId }) => {
  const response = await trainingService.enroll(id, userId);
  return response.data;
});

const trainingSlice = createSlice({
  name: 'training',
  initialState: { trainings: [], selectedTraining: null, loading: false, error: null },
  reducers: { setSelectedTraining: (state, action) => { state.selectedTraining = action.payload; } },
  extraReducers: (builder) => {
    builder.addCase(fetchTrainings.fulfilled, (state, action) => { state.trainings = action.payload; })
      .addCase(createTraining.fulfilled, (state, action) => { state.trainings.push(action.payload); })
      .addCase(enrollTraining.fulfilled, (state, action) => {
        const index = state.trainings.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.trainings[index] = action.payload;
      });
  },
});

export const { setSelectedTraining } = trainingSlice.actions;
export default trainingSlice.reducer;