import React from 'react';
import { Modal, Descriptions, Tag, Timeline, Button, Card, Progress, Steps, Badge, Divider } from 'antd';
import {
  CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined, LockOutlined,
} from '@ant-design/icons';

const severityConfig = {
  critical: { color: 'red',    label: 'Crítico'  },
  high:     { color: 'orange', label: 'Alto'     },
  medium:   { color: 'gold',   label: 'Medio'    },
  low:      { color: 'green',  label: 'Bajo'     },
};

const statusConfig = {
  open:       { badge: 'error',   label: 'Abierto',     step: 0 },
  inProgress: { badge: 'warning', label: 'En Progreso', step: 1 },
  resolved:   { badge: 'success', label: 'Resuelto',    step: 2 },
  closed:     { badge: 'default', label: 'Cerrado',     step: 3 },
};

const categoryColors = {
  technical: 'cyan',
  process:   'blue',
  security:  'red',
  service:   'purple',
  quality:   'green',
};

const IncidentDetail = ({ visible, onClose, incident, onResolve }) => {
  if (!incident) return null;

  const sev    = severityConfig[incident.severity] || severityConfig.low;
  const stat   = statusConfig[incident.status]     || statusConfig.open;
  const slaUsed = incident.slaTime ? Math.round((incident.resolutionTime / incident.slaTime) * 100) : 0;
  const slaOk   = slaUsed <= 100;

  const timelineItems = [
    { color: 'blue',  dot: <ExclamationCircleOutlined />, label: 'Reportado',   time: incident.reportedDate,    desc: `Por: ${incident.reportedBy}` },
    { color: 'orange',dot: <ClockCircleOutlined />,       label: 'Asignado',    time: incident.assignedDate,    desc: `A: ${incident.assignedTo || '—'}` },
    { color: 'purple',dot: <ClockCircleOutlined />,       label: 'En análisis', time: incident.analysisDate,    desc: 'Análisis de causa raíz iniciado' },
    { color: 'green', dot: <CheckCircleOutlined />,       label: 'Resolución',  time: incident.resolutionDate,  desc: incident.resolution || 'Pendiente' },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="font-bold">Incidente #{incident.id}</span>
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
          <Button key="resolve" type="primary" icon={<CheckCircleOutlined />} onClick={() => onResolve?.(incident)}>
            Resolver Incidente
          </Button>
        ),
      ].filter(Boolean)}
    >
      {/* Título y progreso */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-base font-semibold mb-2">{incident.title}</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Progreso de resolución</div>
            <Progress percent={incident.progress} status={incident.status === 'resolved' ? 'success' : 'active'} />
          </div>
          {incident.slaTime && (
            <div className="text-center min-w-20">
              <div className="text-xs text-gray-500 mb-1">SLA</div>
              <Progress
                type="circle" width={60}
                percent={Math.min(slaUsed, 100)}
                strokeColor={slaOk ? '#52c41a' : '#ff4d4f'}
                format={() => <span className="text-xs">{slaOk ? '✓' : '!'}</span>}
              />
              <div className="text-xs text-gray-400 mt-1">{incident.resolutionTime || 0}/{incident.slaTime}h</div>
            </div>
          )}
        </div>
      </div>

      {/* Pasos del proceso */}
      <Steps
        current={stat.step} size="small" className="mb-4"
        items={[
          { title: 'Reportado',    icon: <ExclamationCircleOutlined /> },
          { title: 'En Progreso',  icon: <ClockCircleOutlined />       },
          { title: 'Resuelto',     icon: <CheckCircleOutlined />       },
          { title: 'Cerrado',      icon: <LockOutlined />              },
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Columna izquierda — Detalles */}
        <div>
          <Card size="small" title="Información del Incidente" className="mb-3">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Categoría">
                <Tag color={categoryColors[incident.category]}>{incident.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Norma">
                {incident.standard ? <Tag color="geekblue">{incident.standard.toUpperCase()}</Tag> : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Reportado por">{incident.reportedBy}</Descriptions.Item>
              <Descriptions.Item label="Asignado a">{incident.assignedTo || '—'}</Descriptions.Item>
              <Descriptions.Item label="Descripción">
                <span className="text-xs">{incident.description}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Impacto">
                <span className="text-xs text-red-600">{incident.impact}</span>
              </Descriptions.Item>
              {incident.workaround && (
                <Descriptions.Item label="Workaround">
                  <span className="text-xs text-blue-600">{incident.workaround}</span>
                </Descriptions.Item>
              )}
              {incident.resolution && (
                <Descriptions.Item label="Resolución">
                  <span className="text-xs text-green-600">{incident.resolution}</span>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </div>

        {/* Columna derecha — Línea de tiempo */}
        <div>
          <Card size="small" title="Línea de Tiempo">
            <Timeline
              items={timelineItems.map(item => ({
                color: item.time ? item.color : 'gray',
                dot: item.dot,
                children: (
                  <div>
                    <div className="font-medium text-sm">{item.label}</div>
                    {item.time
                      ? <div className="text-xs text-gray-500">{item.time}</div>
                      : <div className="text-xs text-gray-400 italic">Pendiente</div>
                    }
                    <div className="text-xs text-gray-600">{item.desc}</div>
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