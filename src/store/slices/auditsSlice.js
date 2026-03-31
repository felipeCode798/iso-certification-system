// src/store/slices/auditsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auditsService } from '../../services/api/auditsService';

export const fetchAudits = createAsyncThunk('audits/fetchAll', async () => {
  const response = await auditsService.getAll();
  return response.data;
});

export const createAudit = createAsyncThunk('audits/create', async (auditData) => {
  const response = await auditsService.create(auditData);
  return response.data;
});

export const updateAudit = createAsyncThunk('audits/update', async ({ id, data }) => {
  const response = await auditsService.update(id, data);
  return response.data;
});

export const deleteAudit = createAsyncThunk('audits/delete', async (id) => {
  await auditsService.delete(id);
  return id;
});

const auditsSlice = createSlice({
  name: 'audits',
  initialState: {
    audits: [],
    selectedAudit: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedAudit: (state, action) => {
      state.selectedAudit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAudits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAudits.fulfilled, (state, action) => {
        state.loading = false;
        state.audits = action.payload;
      })
      .addCase(fetchAudits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createAudit.fulfilled, (state, action) => {
        state.audits.push(action.payload);
      })
      .addCase(updateAudit.fulfilled, (state, action) => {
        const index = state.audits.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.audits[index] = action.payload;
        }
      })
      .addCase(deleteAudit.fulfilled, (state, action) => {
        state.audits = state.audits.filter(a => a.id !== action.payload);
      });
  },
});

export const { setSelectedAudit, clearError } = auditsSlice.actions;
export default auditsSlice.reducer;