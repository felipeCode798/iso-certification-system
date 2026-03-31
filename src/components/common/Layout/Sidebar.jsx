// src/components/common/Layout/Sidebar.jsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
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

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/documentation', icon: <FileTextOutlined />, label: 'Documentación' },
    { key: '/processes', icon: <ApartmentOutlined />, label: 'Procesos' },
    { key: '/risks', icon: <SafetyOutlined />, label: 'Gestión de Riesgos' },
    { key: '/incidents', icon: <AlertOutlined />, label: 'Incidentes' },
    { key: '/audits', icon: <AuditOutlined />, label: 'Auditorías' },
    { key: '/training', icon: <BookOutlined />, label: 'Capacitación' },
    { key: '/indicators', icon: <LineChartOutlined />, label: 'Indicadores' },
    { key: '/nonconformities', icon: <CloseCircleOutlined />, label: 'No Conformidades' },
    { key: '/improvement', icon: <RiseOutlined />, label: 'Mejora Continua' },
    { key: '/reports', icon: <FileDoneOutlined />, label: 'Reportes' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Configuración' },
  ];

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={setCollapsed}
      className="shadow-md"
      style={{ background: '#fff' }}
    >
      <div className="h-16 flex items-center justify-center border-b mb-4">
        <h1 className={`font-bold text-blue-600 ${collapsed ? 'text-sm' : 'text-xl'}`}>
          {collapsed ? 'ISO' : 'ISO System'}
        </h1>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className="border-r-0"
      />
    </Sider>
  );
};

export default Sidebar;