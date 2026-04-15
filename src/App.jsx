// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import esES from 'antd/locale/es_ES';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import PrivateRoute from './services/auth/PrivateRoute';
import { Layout } from './components/common/Layout/Layout';
import LoginPage from './pages/Login/LoginPage';
import { routes } from './config/routes';

// Importar páginas dinámicamente
const routeComponents = {
  '/super-admin': React.lazy(() => import('./pages/SuperAdmin/SuperAdminDashboard')),
  '/documentation': React.lazy(() => import('./pages/Documentation/DocumentationPage')),
  '/processes': React.lazy(() => import('./pages/Processes/ProcessesPage')),
  '/risks': React.lazy(() => import('./pages/Risks/RisksPage')),
  '/incidents': React.lazy(() => import('./pages/Incidents/IncidentsPage')),
  '/audits': React.lazy(() => import('./pages/Audits/AuditsPage')),
  '/training': React.lazy(() => import('./pages/Training/TrainingPage')),
  '/indicators': React.lazy(() => import('./pages/Indicators/IndicatorsPage')),
  '/nonconformities': React.lazy(() => import('./pages/NonConformities/NonConformitiesPage')),
  '/improvement': React.lazy(() => import('./pages/Improvement/ImprovementPage')),
  '/reports': React.lazy(() => import('./pages/Reports/ReportsPage')),
  '/settings': React.lazy(() => import('./pages/Settings/SettingsPage')),
};

function App() {
  return (
    <ConfigProvider locale={esES}>
      <AntApp>
        <BrowserRouter>
          <AuthProvider>
            <CompanyProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<PrivateRoute />}>
                  <Route element={<Layout />}>
                    {routes.map((route) => {
                      const Component = routeComponents[route.path] || route.element;
                      return (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            <React.Suspense fallback={<div>Cargando...</div>}>
                              <Component />
                            </React.Suspense>
                          }
                        />
                      );
                    })}
                  </Route>
                </Route>
              </Routes>
            </CompanyProvider>
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;