// src/hooks/usePermissions.js
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPermissions();
    }
  }, [user]);

  const loadPermissions = async () => {
    try {
      // Cargar permisos del usuario desde el backend
      const response = await apiClient.get(`/users/${user.id}/permissions`);
      const permsMap = {};
      response.data.forEach(perm => {
        if (!permsMap[perm.module]) {
          permsMap[perm.module] = {};
        }
        permsMap[perm.module][perm.action] = perm.allowed;
      });
      setPermissions(permsMap);
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (module, action) => {
    return permissions[module]?.[action] === true;
  };

  const hasAnyPermission = (module, actions) => {
    return actions.some(action => permissions[module]?.[action] === true);
  };

  const hasAllPermissions = (module, actions) => {
    return actions.every(action => permissions[module]?.[action] === true);
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};