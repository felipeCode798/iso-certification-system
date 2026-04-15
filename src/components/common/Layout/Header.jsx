// src/components/common/Layout/Header.jsx
import React from 'react';
import { Layout, Avatar, Dropdown, Space, Badge, Select, Tooltip } from 'antd';
import { 
  BellOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  BuildOutlined,
  SwapOutlined 
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useCompany } from '../../../contexts/CompanyContext';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

export const Header = () => {
  const { user, logout } = useAuth();
  const { currentCompany, companies, switchCompany, isSuperAdmin } = useCompany();
  const navigate = useNavigate();

  const userMenu = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mi Perfil',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configuración',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      onClick: logout,
      danger: true,
    },
  ];

  return (
    <AntHeader style={{ background: '#fff', padding: '0 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '32px' }}>
            ISO Certification System
          </div>
          
          {isSuperAdmin && companies.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Cambiar empresa">
                <SwapOutlined style={{ marginRight: 8, color: '#666' }} />
              </Tooltip>
              <Select
                value={currentCompany?.id}
                onChange={(companyId) => {
                  const company = companies.find(c => c.id === companyId);
                  if (company) switchCompany(company);
                }}
                style={{ width: 250 }}
                placeholder="Seleccionar empresa"
              >
                {companies.map(company => (
                  <Select.Option key={company.id} value={company.id}>
                    <Space>
                      <BuildOutlined />
                      <span>{company.businessName}</span>
                      <Badge 
                        status={company.status === 'active' ? 'success' : 'error'} 
                        text={company.status === 'active' ? 'Activa' : 'Inactiva'}
                      />
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
          
          {!isSuperAdmin && currentCompany && (
            <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
              <BuildOutlined style={{ marginRight: 8 }} />
              <span>{currentCompany.businessName}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Badge count={5} size="small">
            <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
          </Badge>
          
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name} {user?.lastName}</span>
              <span style={{ fontSize: '12px', color: '#999' }}>({user?.role})</span>
            </Space>
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  );
};