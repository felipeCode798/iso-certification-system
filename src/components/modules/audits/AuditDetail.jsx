import React from 'react';
import { Modal, Descriptions, Tag, Timeline, Button, Space, Progress, Card, Row, Col, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, UserOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const AuditDetail = ({ visible, onClose, audit }) => {
  if (!audit) return null;

  const getStatusConfig = (status) => {
    const configs = {
      planned: { color: 'processing', text: 'Planificada' },
      inProgress: { color: 'warning', text: 'En Progreso' },
      completed: { color: 'success', text: 'Completada' },
      cancelled: { color: 'error', text: 'Cancelada' },
    };
    return configs[status] || configs.planned;
  };

  const statusConfig = getStatusConfig(audit.status);

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold' }}>Auditoría: {audit.name}</span>
          <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>Cerrar</Button>,
        audit.status === 'completed' && (
          <Button key="report" type="primary" icon={<FileTextOutlined />}>
            Ver Informe Completo
          </Button>
        ),
      ].filter(Boolean)}
    >
      <Row gutter={16} className="mb-4">
        <Col span={24}>
          <Card size="small">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm">Progreso de la Auditoría</div>
                <Progress percent={audit.progress || 0} status={audit.status === 'completed' ? 'success' : 'active'} />
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-sm">Código</div>
                <div className="font-mono font-bold">{audit.auditCode}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Tipo">
          <Tag color="blue">{audit.type === 'internal' ? 'Interna' : audit.type === 'external' ? 'Externa' : audit.type === 'certification' ? 'Certificación' : 'Seguimiento'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Norma">
          <Tag color="geekblue">
            {audit.standard === 'iso9001' ? 'ISO 9001:2015 - Calidad' : 
             audit.standard === 'iso27001' ? 'ISO 27001:2022 - Seguridad' : 
             'ISO 20000:2018 - Servicios TI'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Fecha">
          {audit.auditDate ? dayjs(audit.auditDate).format('DD/MM/YYYY') : 'No definida'}
        </Descriptions.Item>
        <Descriptions.Item label="Duración">
          {audit.duration || 1} días
        </Descriptions.Item>
        <Descriptions.Item label="Auditor Líder">
          <Space><UserOutlined /> {audit.auditor}</Space>
        </Descriptions.Item>
        <Descriptions.Item label="Equipo Auditor">
          {audit.auditTeam?.join(', ') || 'No asignado'}
        </Descriptions.Item>
        <Descriptions.Item label="Ubicación">
          {audit.location || 'No especificada'}
        </Descriptions.Item>
        <Descriptions.Item label="Departamento">
          {audit.department || 'No especificado'}
        </Descriptions.Item>
        <Descriptions.Item label="Alcance" span={2}>
          {audit.scope || 'No definido'}
        </Descriptions.Item>
        <Descriptions.Item label="Objetivos" span={2}>
          {audit.objectives || 'No definidos'}
        </Descriptions.Item>
        {audit.conclusions && (
          <Descriptions.Item label="Conclusiones" span={2}>
            {audit.conclusions}
          </Descriptions.Item>
        )}
      </Descriptions>

      {audit.criteria?.length > 0 && (
        <div className="mt-4">
          <h4>Criterios de Auditoría</h4>
          <Space wrap>
            {audit.criteria.map((c, i) => (
              <Tag key={i} color="purple">{c}</Tag>
            ))}
          </Space>
        </div>
      )}

      {audit.findings?.length > 0 && (
        <div className="mt-4">
          <h4>Hallazgos ({audit.findings.length})</h4>
          <Timeline
            items={audit.findings.slice(0, 5).map(f => ({
              color: f.severity === 'critical' ? 'red' : f.severity === 'major' ? 'orange' : 'blue',
              children: (
                <div>
                  <div className="font-semibold">{f.description}</div>
                  <div className="text-xs text-gray-500">
                    Severidad: {f.severity} | Estado: {f.status}
                  </div>
                </div>
              ),
            }))}
          />
          {audit.findings.length > 5 && (
            <div className="text-center mt-2">
              <Button type="link">Ver todos los {audit.findings.length} hallazgos</Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default AuditDetail;