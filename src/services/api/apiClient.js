// src/services/api/apiClient.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request - Añadir token y companyId
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Añadir companyId para usuarios que no son Super Admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const selectedCompanyId = localStorage.getItem('selectedCompanyId');
    
    if (user.role !== 'Super Administrador' && user.company?.id) {
      // Para usuarios normales, usar su companyId
      config.headers['X-Company-Id'] = user.company.id;
      if (config.params) {
        config.params.companyId = user.company.id;
      } else {
        config.params = { companyId: user.company.id };
      }
    } else if (selectedCompanyId && user.role === 'Super Administrador') {
      // Para Super Admin, usar la empresa seleccionada
      config.headers['X-Company-Id'] = selectedCompanyId;
      if (config.params) {
        config.params.companyId = selectedCompanyId;
      } else {
        config.params = { companyId: selectedCompanyId };
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta - Normalizar datos
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta tiene estructura { data: { data: [...] } }
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedCompanyId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;