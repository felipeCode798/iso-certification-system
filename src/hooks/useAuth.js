// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { authService } from '../services/auth/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      const token = authService.getToken();
      
      if (token && currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al iniciar sesión' };
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al registrar' };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };
};