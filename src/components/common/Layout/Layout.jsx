import React, { useState } from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom'; // ← AGREGAR ESTE IMPORT
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const { Content } = AntLayout;

const Layout = () => { // ← QUITAR { children }
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntLayout className="min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <AntLayout>
        <Header />
        <Content className="m-4 p-4 bg-gray-50 rounded-lg">
          <div className="fade-in">
            <Outlet /> {/* ← CAMBIAR {children} POR <Outlet /> */}
          </div>
        </Content>
        <Footer />
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;