// src/utils/mockData.js

// Documentos mock
export const mockDocuments = [
  { id: 1, code: 'DOC-001', title: 'Manual de Calidad', version: '2.0', type: 'manual', status: 'aprobado', approvalDate: '2024-01-15', reviewDate: '2024-07-15', responsible: 'Admin', description: 'Manual del Sistema de Gestión de Calidad' },
  { id: 2, code: 'DOC-002', title: 'Procedimiento de Auditorías', version: '1.5', type: 'procedure', status: 'aprobado', approvalDate: '2024-01-20', reviewDate: '2024-07-20', responsible: 'Admin', description: 'Procedimiento para realizar auditorías internas' },
  { id: 3, code: 'DOC-003', title: 'Instructivo de Gestión de Riesgos', version: '1.0', type: 'instruction', status: 'revision', approvalDate: '2024-02-01', reviewDate: '2024-08-01', responsible: 'Manager', description: 'Instructivo para identificación y evaluación de riesgos' },
];

// Procesos mock
export const mockProcesses = [
  { id: 1, code: 'PR-001', name: 'Dirección Estratégica', type: 'strategic', owner: 'Gerente General', effectiveness: 95, efficiency: 90, quality: 97, status: 'active', description: 'Planificación y control estratégico de la organización', inputs: 'Contexto organizacional, requisitos legales', outputs: 'Planes estratégicos, objetivos', resources: 'Alta dirección, presupuesto', indicators: 'Cumplimiento de objetivos estratégicos' },
  { id: 2, code: 'PR-002', name: 'Gestión Comercial', type: 'core', owner: 'Gerente Comercial', effectiveness: 88, efficiency: 85, quality: 90, status: 'active', description: 'Ventas, cotizaciones y atención al cliente', inputs: 'Requisitos del cliente, mercado', outputs: 'Contratos, pedidos confirmados', resources: 'Equipo comercial, CRM', indicators: 'Tasa de conversión, satisfacción cliente' },
  { id: 3, code: 'PR-003', name: 'Operaciones', type: 'core', owner: 'Gerente de Operaciones', effectiveness: 92, efficiency: 88, quality: 94, status: 'active', description: 'Producción y entrega de productos/servicios', inputs: 'Pedidos, materias primas', outputs: 'Producto/servicio terminado', resources: 'Personal operativo, maquinaria', indicators: 'OEE, tiempo de ciclo' },
  { id: 4, code: 'PR-004', name: 'Gestión de Calidad', type: 'support', owner: 'Jefe de Calidad', effectiveness: 91, efficiency: 89, quality: 96, status: 'active', description: 'Control y aseguramiento de la calidad', inputs: 'Datos de procesos, no conformidades', outputs: 'Informes de calidad, acciones correctivas', resources: 'Equipo de calidad, laboratorio', indicators: 'Tasa de defectos, no conformidades' },
  { id: 5, code: 'PR-005', name: 'Gestión de RRHH', type: 'support', owner: 'Jefe de RRHH', effectiveness: 86, efficiency: 84, quality: 88, status: 'active', description: 'Selección, formación y desarrollo del personal', inputs: 'Necesidades de personal, perfiles', outputs: 'Personal competente, planes de formación', resources: 'Equipo RRHH, plataforma de formación', indicators: 'Rotación, satisfacción empleados' },
  { id: 6, code: 'PR-006', name: 'Gestión de TI', type: 'support', owner: 'Jefe de TI', effectiveness: 89, efficiency: 87, quality: 92, status: 'active', description: 'Infraestructura tecnológica y seguridad informática', inputs: 'Requerimientos tecnológicos', outputs: 'Sistemas disponibles, soporte técnico', resources: 'Equipo TI, infraestructura', indicators: 'Disponibilidad sistemas, incidentes TI' },
  { id: 7, code: 'PR-007', name: 'Mejora Continua', type: 'strategic', owner: 'Responsable de Mejora', effectiveness: 83, efficiency: 80, quality: 85, status: 'review', description: 'Identificación e implementación de mejoras', inputs: 'Resultados de auditorías, KPIs', outputs: 'Planes de mejora, lecciones aprendidas', resources: 'Equipo multidisciplinario', indicators: 'Proyectos de mejora completados' },
];

// Riesgos mock
export const mockRisks = [
  { id: 1, name: 'Falla en sistema crítico',      category: 'technological', probability: 3, impact: 4, riskLevel: 12, status: 'active',   responsible: 'Jefe de TI',       description: 'Posible caída del sistema principal de producción',   cause: 'Falta de mantenimiento preventivo',         effect: 'Interrupción del servicio hasta 48h',     treatment: 'Mitigar',    mitigationPlan: 'Plan de mantenimiento preventivo mensual y redundancia de sistemas', identificationDate: '2024-01-10', reviewDate: '2024-04-10', standard: 'iso27001' },
  { id: 2, name: 'Incumplimiento normativo',       category: 'legal',         probability: 2, impact: 5, riskLevel: 10, status: 'active',   responsible: 'Gerente Legal',    description: 'Riesgo de incumplir regulaciones vigentes',           cause: 'Cambios en legislación no monitoreados',    effect: 'Sanciones económicas y pérdida de licencias', treatment: 'Transferir', mitigationPlan: 'Monitoreo mensual de cambios normativos y asesoría legal', identificationDate: '2024-01-15', reviewDate: '2024-04-15', standard: 'iso9001'  },
  { id: 3, name: 'Pérdida de información',         category: 'operational',   probability: 2, impact: 4, riskLevel: 8,  status: 'mitigado', responsible: 'Jefe de TI',       description: 'Pérdida de datos sensibles de clientes',               cause: 'Ausencia de backups automatizados',          effect: 'Pérdida de datos críticos y multas GDPR', treatment: 'Mitigar',    mitigationPlan: 'Backups automáticos diarios con retención 30 días',       identificationDate: '2024-01-20', reviewDate: '2024-04-20', standard: 'iso27001' },
  { id: 4, name: 'Rotación alta de personal clave',category: 'strategic',     probability: 3, impact: 3, riskLevel: 9,  status: 'active',   responsible: 'Jefe de RRHH',     description: 'Pérdida de conocimiento crítico por salida de empleados',cause: 'Falta de plan de retención',                effect: 'Reducción de capacidad operativa',         treatment: 'Mitigar',    mitigationPlan: 'Plan de retención y documentación del conocimiento',       identificationDate: '2024-01-25', reviewDate: '2024-04-25', standard: 'iso9001'  },
  { id: 5, name: 'Fraude financiero interno',      category: 'financial',     probability: 1, impact: 5, riskLevel: 5,  status: 'active',   responsible: 'Gerente Financiero',description: 'Riesgo de fraude por personal interno',                cause: 'Controles insuficientes de acceso financiero',effect: 'Pérdidas económicas significativas',       treatment: 'Controlar',  mitigationPlan: 'Segregación de funciones y auditorías sorpresa',           identificationDate: '2024-02-01', reviewDate: '2024-05-01', standard: 'iso27001' },
  { id: 6, name: 'Fallo en cadena de suministro',  category: 'operational',   probability: 2, impact: 3, riskLevel: 6,  status: 'active',   responsible: 'Gerente de Compras',description: 'Interrupción de proveedores críticos',                 cause: 'Dependencia de proveedor único',            effect: 'Retrasos en producción y entrega',         treatment: 'Mitigar',    mitigationPlan: 'Diversificación de proveedores y stock de seguridad',      identificationDate: '2024-02-05', reviewDate: '2024-05-05', standard: 'iso9001'  },
];
// Incidentes mock
export const mockIncidents = [
  { id: 1, title: 'Fallo en servidor de producción',    severity: 'critical', status: 'inProgress', category: 'technical',  reportedDate: '2024-02-10 08:30', reportedBy: 'Carlos Ruiz',    assignedTo: 'Equipo TI',         assignedDate: '2024-02-10 09:00', analysisDate: '2024-02-10 10:00', resolutionDate: null,           description: 'Servidor principal sin respuesta desde las 8:25am', impact: 'Interrupción total del servicio de producción, 200 usuarios afectados', workaround: 'Redirección de tráfico a servidor secundario', resolution: null, slaTime: 4,  resolutionTime: 2,  progress: 60, standard: 'iso27001' },
  { id: 2, title: 'Error en proceso de facturación',    severity: 'high',     status: 'open',       category: 'process',   reportedDate: '2024-02-12 14:00', reportedBy: 'Ana Martínez',   assignedTo: 'Equipo Finanzas',   assignedDate: '2024-02-12 14:30', analysisDate: null,              resolutionDate: null,           description: 'Facturas no generadas correctamente para clientes premium', impact: 'Retraso en facturación mensual, riesgo de incumplimiento contractual', workaround: 'Proceso manual temporal', resolution: null, slaTime: 8,  resolutionTime: 0,  progress: 30, standard: 'iso9001'  },
  { id: 3, title: 'Brecha de seguridad en accesos',     severity: 'critical', status: 'resolved',   category: 'security',  reportedDate: '2024-02-08 23:00', reportedBy: 'Sistema SIEM',   assignedTo: 'Jefe de Seguridad', assignedDate: '2024-02-08 23:05', analysisDate: '2024-02-09 01:00', resolutionDate: '2024-02-09 06:00', description: 'Acceso no autorizado detectado en base de datos de clientes', impact: 'Posible exposición de datos personales de 50 clientes', workaround: 'Bloqueo inmediato de accesos sospechosos', resolution: 'Parche de seguridad aplicado, credenciales revocadas y rotadas', slaTime: 2,  resolutionTime: 7,  progress: 100, standard: 'iso27001' },
  { id: 4, title: 'No conformidad en auditoría',        severity: 'medium',   status: 'open',       category: 'quality',   reportedDate: '2024-02-14 10:00', reportedBy: 'Juan Pérez',     assignedTo: 'Jefe de Calidad',   assignedDate: '2024-02-14 10:30', analysisDate: null,              resolutionDate: null,           description: 'Procedimiento de control de calidad no documentado según ISO 9001', impact: 'Riesgo de no conformidad en próxima auditoría externa', workaround: null, resolution: null, slaTime: 48, resolutionTime: 0,  progress: 10, standard: 'iso9001'  },
  { id: 5, title: 'Interrupción del servicio de email', severity: 'medium',   status: 'resolved',   category: 'technical', reportedDate: '2024-02-06 09:00', reportedBy: 'Soporte',        assignedTo: 'Equipo TI',         assignedDate: '2024-02-06 09:15', analysisDate: '2024-02-06 09:30', resolutionDate: '2024-02-06 11:00', description: 'Servidor de correo sin respuesta', impact: 'Comunicaciones internas interrumpidas por 2 horas', workaround: 'Uso de correos personales temporalmente', resolution: 'Reinicio del servicio SMTP y ajuste de configuración', slaTime: 4,  resolutionTime: 2,  progress: 100, standard: 'iso20000' },
  { id: 6, title: 'Incumplimiento SLA con cliente',     severity: 'high',     status: 'closed',     category: 'service',   reportedDate: '2024-02-03 16:00', reportedBy: 'Gerente Comercial', assignedTo: 'Gerente de Operaciones', assignedDate: '2024-02-03 16:30', analysisDate: '2024-02-04 09:00', resolutionDate: '2024-02-05 17:00', description: 'Tiempo de respuesta excedió el SLA acordado con cliente VIP', impact: 'Riesgo de penalización contractual por $5,000', workaround: 'Comunicación proactiva con cliente y compensación parcial', resolution: 'Plan de mejora de capacidad aprobado e implementado', slaTime: 24, resolutionTime: 49, progress: 100, standard: 'iso9001'  },
];

// Auditorías mock
export const mockAudits = [
  { id: 1, name: 'Auditoría Interna ISO 9001', type: 'internal', standard: 'iso9001', auditor: 'Juan Pérez', auditDate: '2024-02-15', status: 'planned', progress: 0, scope: 'Todos los procesos de calidad' },
  { id: 2, name: 'Auditoría ISO 27001', type: 'certification', standard: 'iso27001', auditor: 'María López', auditDate: '2024-02-20', status: 'inProgress', progress: 45, scope: 'Seguridad de la información' },
];

// Capacitaciones mock
export const mockTrainings = [
  { id: 1, title: 'Curso de Auditor Interno ISO 9001', type: 'internal', instructor: 'Carlos Ruiz', date: '2024-02-25', duration: 16, enrolled: 12, capacity: 20, status: 'planned' },
  { id: 2, title: 'Gestión de Riesgos ISO 27001', type: 'external', instructor: 'Ana Martínez', date: '2024-03-05', duration: 8, enrolled: 8, capacity: 15, status: 'planned' },
];

// No conformidades mock
export const mockNCs = [
  { id: 1, description: 'Falta de registro en proceso de auditoría', severity: 'major', source: 'audit', status: 'open', detectionDate: '2024-02-01', progress: 20, standard: 'iso9001' },
  { id: 2, description: 'Documentación desactualizada', severity: 'minor', source: 'internal', status: 'inAnalysis', detectionDate: '2024-02-05', progress: 50, standard: 'iso27001' },
];

// Hallazgos de auditoría mock
export const mockFindings = [
  { id: 1, auditId: 1, description: 'El manual de calidad no incluye el proceso de mejora continua', severity: 'major', clause: '10.3', requirement: 'Mejora continua del SGC', requiredAction: 'Actualizar manual de calidad', deadline: '2024-03-15', responsible: 'Jefe de Calidad', status: 'open' },
  { id: 2, auditId: 1, description: 'No se evidencia seguimiento a indicadores de proceso', severity: 'minor', clause: '9.1.3', requirement: 'Análisis y evaluación', requiredAction: 'Implementar tablero de indicadores', deadline: '2024-03-30', responsible: 'Coordinador de Calidad', status: 'open' },
  { id: 3, auditId: 2, description: 'Falta de registros de control de acceso a sistemas', severity: 'critical', clause: '9.4.2', requirement: 'Control de accesos', requiredAction: 'Implementar logs de acceso', deadline: '2024-03-10', responsible: 'Jefe de TI', status: 'inProgress' },
];

// Dashboard stats mock
export const mockDashboardStats = {
  documents: 245,
  risks: 48,
  incidents: 12,
  audits: 28,
  compliance: {
    iso9001: 92,
    iso27001: 88,
    iso20000: 85,
  },
  recentIncidents: [
    { title: 'Fallo en servidor', status: 'resuelto', date: '2024-02-10' },
    { title: 'No conformidad en proceso', status: 'en progreso', date: '2024-02-12' },
    { title: 'Riesgo identificado', status: 'pendiente', date: '2024-02-13' },
  ],
  upcomingAudits: [
    { name: 'Auditoría Interna ISO 9001', date: '2024-02-15', status: 'programada' },
    { name: 'Auditoría ISO 27001', date: '2024-02-20', status: 'programada' },
  ],
  kpiData: [
    { name: 'Ene', cumplimiento: 85, auditorias: 5 },
    { name: 'Feb', cumplimiento: 88, auditorias: 7 },
    { name: 'Mar', cumplimiento: 92, auditorias: 6 },
    { name: 'Abr', cumplimiento: 90, auditorias: 8 },
    { name: 'May', cumplimiento: 94, auditorias: 9 },
    { name: 'Jun', cumplimiento: 96, auditorias: 10 },
  ],
};


