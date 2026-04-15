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
  TeamOutlined,
} from '@ant-design/icons';

export const menuConfig = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    permissions: ['Super Administrador', 'Administrador ISO', 'Gerente', 'Auditor Interno', 'Colaborador'],
  },
  {
    key: '/super-admin',
    icon: <TeamOutlined />,
    label: 'Super Admin',
    permissions: ['Super Administrador'],
  },
  {
    key: '/documentation',
    icon: <FileTextOutlined />,
    label: 'Documentación',
    permissions: ['Super Administrador', 'Administrador ISO', 'Gerente', 'Auditor Interno'],
  },
  {
    key: '/processes',
    icon: <ApartmentOutlined />,
    label: 'Procesos',
    permissions: ['Super Administrador', 'Administrador ISO', 'Gerente'],
  },
  {
    key: '/risks',
    icon: <SafetyOutlined />,
    label: 'Gestión de Riesgos',
    permissions: ['Super Administrador', 'Administrador ISO', 'Gerente', 'Auditor Interno'],
  },
  {
    key: '/incidents',
    icon: <AlertOutlined />,
    label: 'Incidentes',
    permissions: ['Super Administrador', 'Administrador ISO', 'Gerente', 'Colaborador'],
  },
  {
    key: '/audits',
    icon: <AuditOutlined />,
    label: 'Auditorías',
    permissions: ['Super Administrador', 'Administrador ISO', 'Auditor Interno'],
  },
  {
    key: '/training',
    icon: <BookOutlined />,
    label: 'Capacitación',
    permissions: ['Super Administrador', 'Administrador ISO', 'Gerente'],
  },
  {
    key: '/indicators',
    icon: <LineChartOutlined />,
    label: 'Indicadores',
    permissions: ['Super Administrador', 'Administrador ISO', 'Gerente'],
  },
  {
    key: '/nonconformities',
    icon: <CloseCircleOutlined />,
    label: 'No Conformidades',
    permissions: ['Super Administrador', 'Administrador ISO', 'Gerente', 'Auditor Interno'],
  },
  {
    key: '/improvement',
    icon: <RiseOutlined />,
    label: 'Mejora Continua',
    permissions: ['Super Administrador', 'Administrador ISO', 'Gerente'],
  },
  {
    key: '/reports',
    icon: <FileDoneOutlined />,
    label: 'Reportes',
    permissions: ['Super Administrador', 'Administrador ISO', 'Gerente', 'Auditor Interno'],
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Configuración',
    permissions: ['Super Administrador', 'Administrador ISO'],
  },
];