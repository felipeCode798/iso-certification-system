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
  { path: '/', element: Dashboard, name: 'Dashboard' },
  { path: '/documentation', element: DocumentationPage, name: 'Documentación' },
  { path: '/processes', element: ProcessesPage, name: 'Procesos' },
  { path: '/risks', element: RisksPage, name: 'Riesgos' },
  { path: '/incidents', element: IncidentsPage, name: 'Incidentes' },
  { path: '/audits', element: AuditsPage, name: 'Auditorías' },
  { path: '/training', element: TrainingPage, name: 'Capacitación' },
  { path: '/indicators', element: IndicatorsPage, name: 'Indicadores' },
  { path: '/nonconformities', element: NonConformitiesPage, name: 'No Conformidades' },
  { path: '/improvement', element: ImprovementPage, name: 'Mejora Continua' },
  { path: '/reports', element: ReportsPage, name: 'Reportes' },
  { path: '/settings', element: SettingsPage, name: 'Configuración' },
];

export const publicRoutes = [
  { path: '/login', element: null, name: 'Login' },
  { path: '/register', element: null, name: 'Register' },
];