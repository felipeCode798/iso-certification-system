// src/store/slices/documentationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentationService from '../../services/api/documentationService';

export const fetchDocuments = createAsyncThunk('documents/fetchAll', async () => {
  const response = await documentationService.getAll();
  return response.data;
});

export const createDocument = createAsyncThunk('documents/create', async (data) => {
  const response = await documentationService.create(data);
  return response.data;
});

export const updateDocument = createAsyncThunk('documents/update', async ({ id, data }) => {
  const response = await documentationService.update(id, data);
  return response.data;
});

export const deleteDocument = createAsyncThunk('documents/delete', async (id) => {
  await documentationService.delete(id);
  return id;
});

const documentationSlice = createSlice({
  name: 'documents',
  initialState: { documents: [], selectedDocument: null, loading: false, error: null },
  reducers: { setSelectedDocument: (state, action) => { state.selectedDocument = action.payload; }, clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder.addCase(fetchDocuments.pending, (state) => { state.loading = true; })
      .addCase(fetchDocuments.fulfilled, (state, action) => { state.loading = false; state.documents = action.payload; })
      .addCase(fetchDocuments.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createDocument.fulfilled, (state, action) => { state.documents.push(action.payload); })
      .addCase(updateDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(d => d.id === action.payload.id);
        if (index !== -1) state.documents[index] = action.payload;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => { state.documents = state.documents.filter(d => d.id !== action.payload); });
  },
});

export const { setSelectedDocument, clearError } = documentationSlice.actions;
export default documentationSlice.reducer;