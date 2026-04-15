// src/contexts/CompanyContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../services/api/apiClient';
import { useAuth } from './AuthContext';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/companies');
      setCompanies(response.data);
      if (response.data.length > 0 && !currentCompany) {
        const savedCompanyId = localStorage.getItem('selectedCompanyId');
        const companyToSelect = savedCompanyId 
          ? response.data.find(c => c.id === savedCompanyId)
          : response.data[0];
        if (companyToSelect) {
          setCurrentCompany(companyToSelect);
        }
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  }, [currentCompany]);

  useEffect(() => {
    if (user?.role === 'Super Administrador') {
      loadCompanies();
    } else if (user?.company) {
      setCurrentCompany(user.company);
    }
  }, [user, loadCompanies]);

  const switchCompany = (company) => {
    setCurrentCompany(company);
    localStorage.setItem('selectedCompanyId', company.id);
    window.location.reload();
  };

  return (
    <CompanyContext.Provider
      value={{
        currentCompany,
        companies,
        loading,
        switchCompany,
        loadCompanies,
        isSuperAdmin: user?.role === 'Super Administrador',
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};