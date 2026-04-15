// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  const checkAuth = useCallback(() => {
    const currentUser = authService.getCurrentUser();
    const currentToken = authService.getToken();
    
    if (currentToken && currentUser) {
      setUser(currentUser);
      setToken(currentToken);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      // Verifica la estructura de la respuesta
      if (response.data?.token || response?.data?.data?.token) {
        // La respuesta tiene la estructura correcta
        checkAuth(); // Recargar el estado después del login
        return { success: true };
      }
      return { success: false, error: 'Respuesta inválida del servidor' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      await authService.register(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al registrar' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    token,
    login,
    register,
    logout,
    checkAuth, // Exponer esto por si acaso
  };
};