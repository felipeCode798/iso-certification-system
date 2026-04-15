// src/config/routes.js
import Dashboard from '../pages/Dashboard/Dashboard';
import DocumentationPage from '../pages/Documentation/DocumentationPage';
import ProcessesPage from '../pages/Processes/ProcessesPage';
import RisksPage from '../pages/Risks/RisksPage';
import IncidentsPage from '../pages/Incidents/IncidentsPage';
import AuditsPage from '../pages/Audits/AuditsPage';
import TrainingPage from '../pages/Training/TrainingPage';
import IndicatorsPage from '../pages/Indicators/IndicatorsPage';
import NonConformitiesPage from '../pages/NonConformities/NonConformitiesPage';
import ImprovementPage from '../pages/Improvement/ImprovementPage';
import ReportsPage from '../pages/Reports/ReportsPage';
import SettingsPage from '../pages/Settings/SettingsPage';

export const routes = [
  { path: '/', element: Dashboard, name: 'Dashboard', roles: ['Super Administrador', 'Administrador ISO', 'Gerente', 'Auditor Interno', 'Colaborador'] },
  { path: '/documentation', element: DocumentationPage, name: 'Documentación', roles: ['Super Administrador', 'Administrador ISO', 'Gerente', 'Auditor Interno'] },
  { path: '/processes', element: ProcessesPage, name: 'Procesos', roles: ['Super Administrador', 'Administrador ISO', 'Gerente'] },
  { path: '/risks', element: RisksPage, name: 'Riesgos', roles: ['Super Administrador', 'Administrador ISO', 'Gerente', 'Auditor Interno'] },
  { path: '/incidents', element: IncidentsPage, name: 'Incidentes', roles: ['Super Administrador', 'Administrador ISO', 'Gerente', 'Colaborador'] },
  { path: '/audits', element: AuditsPage, name: 'Auditorías', roles: ['Super Administrador', 'Administrador ISO', 'Auditor Interno'] },
  { path: '/training', element: TrainingPage, name: 'Capacitación', roles: ['Super Administrador', 'Administrador ISO', 'Gerente'] },
  { path: '/indicators', element: IndicatorsPage, name: 'Indicadores', roles: ['Super Administrador', 'Administrador ISO', 'Gerente'] },
  { path: '/nonconformities', element: NonConformitiesPage, name: 'No Conformidades', roles: ['Super Administrador', 'Administrador ISO', 'Gerente', 'Auditor Interno'] },
  { path: '/improvement', element: ImprovementPage, name: 'Mejora Continua', roles: ['Super Administrador', 'Administrador ISO', 'Gerente'] },
  { path: '/reports', element: ReportsPage, name: 'Reportes', roles: ['Super Administrador', 'Administrador ISO', 'Gerente', 'Auditor Interno'] },
  { path: '/settings', element: SettingsPage, name: 'Configuración', roles: ['Super Administrador', 'Administrador ISO'] },
];
export const publicRoutes = [
  { path: '/login', element: null, name: 'Login' },
  { path: '/register', element: null, name: 'Register' },
];