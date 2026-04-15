// src/services/auth/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { routes } from '../../config/routes';

const PrivateRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Cargando..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar permisos según la ruta
  const currentRoute = routes.find(route => route.path === location.pathname);
  
  if (currentRoute?.roles && !currentRoute.roles.includes(user?.role)) {
    return (
      <Result
        status="403"
        title="Acceso Denegado"
        subTitle={`No tienes permisos para acceder a ${currentRoute.name}. Se requiere rol: ${currentRoute.roles.join(', ')}`}
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            Volver
          </Button>
        }
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;