// src/utils/constants.js
export const ISO_STANDARDS = {
  ISO_9001: 'ISO 9001:2015',
  ISO_27001: 'ISO 27001:2022',
  ISO_20000: 'ISO 20000:2018',
};

export const DOCUMENT_TYPES = {
  PROCEDURE: 'procedure',
  INSTRUCTION: 'instruction',
  FORMAT: 'format',
  POLICY: 'policy',
  MANUAL: 'manual',
};

export const RISK_LEVELS = {
  LOW: { value: 'low', label: 'Bajo', color: 'green', score: 1 },
  MEDIUM: { value: 'medium', label: 'Medio', color: 'orange', score: 2 },
  HIGH: { value: 'high', label: 'Alto', color: 'red', score: 3 },
  CRITICAL: { value: 'critical', label: 'Crítico', color: 'darkred', score: 4 },
};

export const INCIDENT_SEVERITY = {
  CRITICAL: { value: 'critical', label: 'Crítico', color: 'red', responseTime: 1 },
  HIGH: { value: 'high', label: 'Alto', color: 'orange', responseTime: 4 },
  MEDIUM: { value: 'medium', label: 'Medio', color: 'yellow', responseTime: 24 },
  LOW: { value: 'low', label: 'Bajo', color: 'green', responseTime: 72 },
};

export const AUDIT_STATUS = {
  PLANNED: { value: 'planned', label: 'Planificada', color: 'processing' },
  IN_PROGRESS: { value: 'inProgress', label: 'En Progreso', color: 'warning' },
  COMPLETED: { value: 'completed', label: 'Completada', color: 'success' },
  CANCELLED: { value: 'cancelled', label: 'Cancelada', color: 'error' },
};

export const NC_SEVERITY = {
  CRITICAL: { value: 'critical', label: 'Crítica', color: 'red', daysToClose: 7 },
  MAJOR: { value: 'major', label: 'Mayor', color: 'orange', daysToClose: 15 },
  MINOR: { value: 'minor', label: 'Menor', color: 'yellow', daysToClose: 30 },
};

export const ROLES = {
  ADMIN: 'admin',
  AUDITOR: 'auditor',
  MANAGER: 'manager',
  USER: 'user',
};

export const API_ENDPOINTS = {
  AUTH: '/auth',
  DOCUMENTS: '/documents',
  PROCESSES: '/processes',
  RISKS: '/risks',
  INCIDENTS: '/incidents',
  AUDITS: '/audits',
  TRAINING: '/training',
  INDICATORS: '/indicators',
  NONCONFORMITIES: '/nonconformities',
  IMPROVEMENT: '/improvement',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};