// src/components/common/Layout/Layout.jsx
import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { CompanyProvider } from '../../../contexts/CompanyContext';
import { useAuth } from '../../../contexts/AuthContext';

const { Content } = AntLayout;

export const Layout = ({ children }) => {
  const { user } = useAuth();
  
  // Si no hay usuario o está cargando, no mostrar el layout
  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <CompanyProvider>
      <AntLayout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <AntLayout>
          <Header />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            {children}
          </Content>
          <Footer />
        </AntLayout>
      </AntLayout>
    </CompanyProvider>
  );
};