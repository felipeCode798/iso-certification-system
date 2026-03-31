// src/config/menuConfig.js
import {
  DashboardOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  SafetyOutlined,
  AlertOutlined,
  AuditOutlined,
  BookOutlined,
  LineChartOutlined,
  CloseCircleOutlined,
  RiseOutlined,
  FileDoneOutlined,
  SettingOutlined,
} from '@ant-design/icons';

export const menuConfig = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    permissions: ['admin', 'auditor', 'manager', 'user'],
  },
  {
    key: '/documentation',
    icon: <FileTextOutlined />,
    label: 'Documentación',
    permissions: ['admin', 'auditor', 'manager'],
  },
  {
    key: '/processes',
    icon: <ApartmentOutlined />,
    label: 'Procesos',
    permissions: ['admin', 'manager'],
  },
  {
    key: '/risks',
    icon: <SafetyOutlined />,
    label: 'Gestión de Riesgos',
    permissions: ['admin', 'auditor', 'manager'],
  },
  {
    key: '/incidents',
    icon: <AlertOutlined />,
    label: 'Incidentes',
    permissions: ['admin', 'manager', 'user'],
  },
  {
    key: '/audits',
    icon: <AuditOutlined />,
    label: 'Auditorías',
    permissions: ['admin', 'auditor', 'manager'],
  },
  {
    key: '/training',
    icon: <BookOutlined />,
    label: 'Capacitación',
    permissions: ['admin', 'manager'],
  },
  {
    key: '/indicators',
    icon: <LineChartOutlined />,
    label: 'Indicadores',
    permissions: ['admin', 'manager'],
  },
  {
    key: '/nonconformities',
    icon: <CloseCircleOutlined />,
    label: 'No Conformidades',
    permissions: ['admin', 'auditor', 'manager'],
  },
  {
    key: '/improvement',
    icon: <RiseOutlined />,
    label: 'Mejora Continua',
    permissions: ['admin', 'manager'],
  },
  {
    key: '/reports',
    icon: <FileDoneOutlined />,
    label: 'Reportes',
    permissions: ['admin', 'auditor', 'manager'],
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Configuración',
    permissions: ['admin'],
  },
];