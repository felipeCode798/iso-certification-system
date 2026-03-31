// src/components/common/Layout/Header.jsx
import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Badge, Space, Typography, Button } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SafetyOutlined,
  AlertOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications] = useState([
    { id: 1, title: 'Auditoría programada', description: 'ISO 9001 para mañana' },
    { id: 2, title: 'Documento por revisar', description: 'Procedimiento actualizado' },
  ]);


  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Mi Perfil
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Configuración
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu className="w-80">
      <Menu.Item key="header" className="font-bold" disabled>
        Notificaciones
      </Menu.Item>
      {notifications.map(notif => (
        <Menu.Item key={notif.id}>
          <div>
            <Text strong>{notif.title}</Text>
            <br />
            <Text type="secondary" className="text-xs">{notif.description}</Text>
          </div>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <Menu.Item key="viewAll" className="text-center">
        Ver todas las notificaciones
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="bg-white shadow-sm px-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="text-xl font-bold text-blue-600 mr-8">
          ISO Certification System
        </div>
        <Menu mode="horizontal" className="border-0">
          <Menu.Item key="dashboard" icon={<DashboardOutlined />} onClick={() => navigate('/')}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="docs" icon={<FileTextOutlined />} onClick={() => navigate('/documentation')}>
            Documentación
          </Menu.Item>
          <Menu.Item key="risks" icon={<SafetyOutlined />} onClick={() => navigate('/risks')}>
            Riesgos
          </Menu.Item>
          <Menu.Item key="incidents" icon={<AlertOutlined />} onClick={() => navigate('/incidents')}>
            Incidentes
          </Menu.Item>
          <Menu.Item key="audits" icon={<AuditOutlined />} onClick={() => navigate('/audits')}>
            Auditorías
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
            Cerrar Sesión
          </Menu.Item>
        </Menu>
      </div>
      
      <Space size="large">
        <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
          <Badge count={notifications.length} className="cursor-pointer">
            <BellOutlined className="text-xl" />
          </Badge>
        </Dropdown>
        
        <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
          <Space className="cursor-pointer">
            <Avatar icon={<UserOutlined />} />
            <Text>{user?.name || 'Usuario'}</Text>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;