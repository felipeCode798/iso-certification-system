// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';
import Layout from './components/common/Layout/Layout';
import PrivateRoute from './services/auth/PrivateRoute';
import LoginPage from './pages/Login/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import DocumentationPage from './pages/Documentation/DocumentationPage';
import ProcessesPage from './pages/Processes/ProcessesPage';
import RisksPage from './pages/Risks/RisksPage';
import IncidentsPage from './pages/Incidents/IncidentsPage';
import AuditsPage from './pages/Audits/AuditsPage';
import TrainingPage from './pages/Training/TrainingPage';
import IndicatorsPage from './pages/Indicators/IndicatorsPage';
import NonConformitiesPage from './pages/NonConformities/NonConformitiesPage';
import ImprovementPage from './pages/Improvement/ImprovementPage';
import ReportsPage from './pages/Reports/ReportsPage';
import SettingsPage from './pages/Settings/SettingsPage';
import './assets/styles/global.css';

const queryClient = new QueryClient();

function App() {
  // Verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              colorPrimary: '#1890ff',
              borderRadius: 6,
            },
          }}
        >
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="documentation" element={<DocumentationPage />} />
                  <Route path="processes" element={<ProcessesPage />} />
                  <Route path="risks" element={<RisksPage />} />
                  <Route path="incidents" element={<IncidentsPage />} />
                  <Route path="audits" element={<AuditsPage />} />
                  <Route path="training" element={<TrainingPage />} />
                  <Route path="indicators" element={<IndicatorsPage />} />
                  <Route path="nonconformities" element={<NonConformitiesPage />} />
                  <Route path="improvement" element={<ImprovementPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
          </Router>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;