// src/components/modules/PermissionGuard/PermissionGuard.jsx
import React from 'react';
import { usePermissions } from '../../../hooks/usePermissions';
import { Result, Button } from 'antd';

export const PermissionGuard = ({ 
  module, 
  action, 
  children, 
  fallback = null 
}) => {
  const { hasPermission, loading } = usePermissions();

  if (loading) {
    return <div>Cargando permisos...</div>;
  }

  if (!hasPermission(module, action)) {
    return fallback || (
      <Result
        status="403"
        title="Acceso Denegado"
        subTitle="No tienes permisos para acceder a esta sección"
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            Volver
          </Button>
        }
      />
    );
  }

  return children;
};