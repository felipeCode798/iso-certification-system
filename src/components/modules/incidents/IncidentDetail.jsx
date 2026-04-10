import React from 'react';
import { Modal, Descriptions, Tag, Timeline, Button, Card, Progress, Steps, Badge } from 'antd';
import {
  CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined, LockOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const severityConfig = {
  critical: { color: 'red', label: 'Crítico' },
  high: { color: 'orange', label: 'Alto' },
  medium: { color: 'gold', label: 'Medio' },
  low: { color: 'green', label: 'Bajo' },
};

const statusConfig = {
  open: { badge: 'error', label: 'Abierto', step: 0 },
  inProgress: { badge: 'warning', label: 'En Progreso', step: 1 },
  resolved: { badge: 'success', label: 'Resuelto', step: 2 },
  closed: { badge: 'default', label: 'Cerrado', step: 3 },
};

const categoryColors = {
  technical: 'cyan',
  process: 'blue',
  security: 'red',
  service: 'purple',
  quality: 'green',
};

const IncidentDetail = ({ visible, onClose, incident, onResolve }) => {
  if (!incident) return null;

  const sev = severityConfig[incident.severity] || severityConfig.low;
  const stat = statusConfig[incident.status] || statusConfig.open;
  
  // Cálculo SLA con datos reales
  const slaUsed = incident.slaTime && incident.resolutionTime 
    ? Math.round((incident.resolutionTime / incident.slaTime) * 100) 
    : 0;
  const slaOk = slaUsed <= 100;

  const formatDate = (date) => {
    if (!date) return null;
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  };

  // Timeline DINÁMICA con datos reales del backend
  const timelineItems = [
    { 
      color: incident.reportedDate ? 'blue' : 'gray', 
      dot: <ExclamationCircleOutlined />, 
      label: 'Reportado', 
      time: incident.reportedDate, 
      desc: `Por: ${incident.reportedBy || '—'}` 
    },
    { 
      color: incident.assignedDate ? 'orange' : 'gray', 
      dot: <ClockCircleOutlined />, 
      label: 'Asignado', 
      time: incident.assignedDate, 
      desc: `A: ${incident.assignedTo || '—'}` 
    },
    { 
      color: incident.analysisDate ? 'purple' : 'gray', 
      dot: <ClockCircleOutlined />, 
      label: 'En análisis', 
      time: incident.analysisDate, 
      desc: incident.rootCause ? 'Análisis de causa raíz completado' : 'Análisis de causa raíz pendiente' 
    },
    { 
      color: incident.resolutionDate ? 'green' : 'gray', 
      dot: <CheckCircleOutlined />, 
      label: 'Resolución', 
      time: incident.resolutionDate, 
      desc: incident.resolution || 'Pendiente' 
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold' }}>Incidente #{incident.id}</span>
          <Tag color={sev.color}>{sev.label}</Tag>
          <Badge status={stat.badge} text={stat.label} />
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={860}
      footer={[
        <Button key="close" onClick={onClose}>Cerrar</Button>,
        incident.status !== 'resolved' && incident.status !== 'closed' && (
          <Button 
            key="resolve" 
            type="primary" 
            icon={<CheckCircleOutlined />} 
            onClick={() => onResolve?.(incident)}
          >
            Resolver Incidente
          </Button>
        ),
      ].filter(Boolean)}
    >
      <div style={{ marginBottom: '16px', padding: '16px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #e8e8e8' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{incident.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Progreso de resolución</div>
            <Progress 
              percent={incident.progress || 0} 
              status={incident.status === 'resolved' ? 'success' : 'active'} 
            />
          </div>
          {incident.slaTime && (
            <div style={{ textAlign: 'center', minWidth: '80px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>SLA</div>
              <Progress
                type="circle"
                width={60}
                percent={Math.min(slaUsed, 100)}
                strokeColor={slaOk ? '#52c41a' : '#ff4d4f'}
                format={() => <span style={{ fontSize: '12px' }}>{slaOk ? '✓' : '!'}</span>}
              />
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                {incident.resolutionTime || 0}/{incident.slaTime}h
              </div>
            </div>
          )}
        </div>
      </div>

      <Steps
        current={stat.step}
        size="small"
        style={{ marginBottom: '16px' }}
        items={[
          { title: 'Reportado', icon: <ExclamationCircleOutlined /> },
          { title: 'En Progreso', icon: <ClockCircleOutlined /> },
          { title: 'Resuelto', icon: <CheckCircleOutlined /> },
          { title: 'Cerrado', icon: <LockOutlined /> },
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Card size="small" title="Información del Incidente" style={{ marginBottom: '12px' }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Categoría">
                <Tag color={categoryColors[incident.category]}>{incident.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Norma">
                {incident.standard ? <Tag color="geekblue">{incident.standard.toUpperCase()}</Tag> : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Reportado por">{incident.reportedBy || '—'}</Descriptions.Item>
              <Descriptions.Item label="Asignado a">{incident.assignedTo || '—'}</Descriptions.Item>
              <Descriptions.Item label="Descripción">
                <span style={{ fontSize: '12px' }}>{incident.description}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Impacto">
                <span style={{ fontSize: '12px', color: '#ff4d4f' }}>{incident.impact || 'No especificado'}</span>
              </Descriptions.Item>
              {incident.workaround && (
                <Descriptions.Item label="Workaround">
                  <span style={{ fontSize: '12px', color: '#1890ff' }}>{incident.workaround}</span>
                </Descriptions.Item>
              )}
              {incident.resolution && (
                <Descriptions.Item label="Resolución">
                  <span style={{ fontSize: '12px', color: '#52c41a' }}>{incident.resolution}</span>
                </Descriptions.Item>
              )}
              {incident.rootCause && (
                <Descriptions.Item label="Causa Raíz">
                  <span style={{ fontSize: '12px' }}>{incident.rootCause}</span>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </div>

        <div>
          <Card size="small" title="Línea de Tiempo">
            <Timeline
              items={timelineItems.map(item => ({
                color: item.time ? item.color : 'gray',
                dot: item.dot,
                children: (
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '13px' }}>{item.label}</div>
                    {item.time
                      ? <div style={{ fontSize: '11px', color: '#999' }}>{formatDate(item.time)}</div>
                      : <div style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>Pendiente</div>
                    }
                    <div style={{ fontSize: '11px', color: '#666' }}>{item.desc}</div>
                  </div>
                ),
              }))}
            />
          </Card>
        </div>
      </div>
    </Modal>
  );
};

export default IncidentDetail;