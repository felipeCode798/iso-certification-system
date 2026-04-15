// src/hooks/useCompanyId.js
import { useCompany } from '../contexts/CompanyContext';
import { useAuth } from './useAuth';

export const useCompanyId = () => {
  const { currentCompany, isSuperAdmin } = useCompany();
  const { user } = useAuth();

  if (isSuperAdmin) {
    return currentCompany?.id || null;
  }

  return user?.company?.id || null;
};