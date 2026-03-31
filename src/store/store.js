// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import documentationReducer from './slices/documentationSlice';
import processesReducer from './slices/processesSlice';
import risksReducer from './slices/risksSlice';
import incidentsReducer from './slices/incidentsSlice';
import auditsReducer from './slices/auditsSlice';
import trainingReducer from './slices/trainingSlice';
import indicatorsReducer from './slices/indicatorsSlice';
import nonconformitiesReducer from './slices/nonconformitiesSlice';
import improvementReducer from './slices/improvementSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    documentation: documentationReducer,
    processes: processesReducer,
    risks: risksReducer,
    incidents: incidentsReducer,
    audits: auditsReducer,
    training: trainingReducer,
    indicators: indicatorsReducer,
    nonconformities: nonconformitiesReducer,
    improvement: improvementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});