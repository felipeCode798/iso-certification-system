// src/components/common/Layout/Sidebar.jsx
import React, { useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { menuConfig } from '../../../config/menuConfig';

const { Sider } = Layout;

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Filtrar menús según el rol del usuario
  const filteredMenus = useMemo(() => {
    if (!user?.role) return [];
    
    return menuConfig.filter(menu => 
      menu.permissions.includes(user.role)
    );
  }, [user?.role]);

  return (
    <Sider style={{ background: '#fff' }} width={250}>
      <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.1)' }} />
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={filteredMenus}
        onClick={({ key }) => navigate(key)}
        style={{ height: '100%', borderRight: 0 }}
      />
    </Sider>
  );
};