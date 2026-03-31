// src/services/auth/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  const isAuthenticated = !!token && !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;