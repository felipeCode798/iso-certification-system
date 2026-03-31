// src/components/modules/audits/AuditReport.jsx
import React from 'react';
import { Card, Descriptions, Table, Tag, Button, Space, Typography, Divider, Alert } from 'antd';
import { DownloadOutlined, PrinterOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AuditReport = ({ audit, findings, onExport }) => {
  const summary = {
    totalFindings: findings?.length || 0,
    critical: findings?.filter(f => f.severity === 'critical').length || 0,
    major: findings?.filter(f => f.severity === 'major').length || 0,
    minor: findings?.filter(f => f.severity === 'minor').length || 0,
    observations: findings?.filter(f => f.type === 'observation').length || 0,
  };

  const findingsColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Hallazgo',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Severidad',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => {
        const colors = { critical: 'red', major: 'orange', minor: 'yellow', observation: 'blue' };
        return <Tag color={colors[severity]}>{severity.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Norma',
      dataIndex: 'clause',
      key: 'clause',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'closed' ? 'green' : 'red'}>
          {status === 'closed' ? 'Cerrado' : 'Abierto'}
        </Tag>
      ),
    },
  ];

  const getConclusion = () => {
    if (summary.critical > 0) return 'No Aprobada';
    if (summary.major > 5) return 'Condicionada';
    return 'Aprobada';
  };

  const conclusionColor = {
    'Aprobada': 'success',
    'Condicionada': 'warning',
    'No Aprobada': 'error',
  };

  return (
    <Card>
      <div className="text-center mb-6">
        <Title level={3}>Informe de Auditoría</Title>
        <Text type="secondary">{audit?.name} - {audit?.standard}</Text>
      </div>

      <Descriptions bordered column={2}>
        <Descriptions.Item label="Organización">{audit?.organization}</Descriptions.Item>
        <Descriptions.Item label="Fecha Auditoría">{audit?.auditDate}</Descriptions.Item>
        <Descriptions.Item label="Auditor Líder">{audit?.auditor}</Descriptions.Item>
        <Descriptions.Item label="Equipo Auditor">{audit?.auditTeam?.join(', ')}</Descriptions.Item>
        <Descriptions.Item label="Alcance" span={2}>{audit?.scope}</Descriptions.Item>
        <Descriptions.Item label="Objetivos" span={2}>{audit?.objectives}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Title level={4}>Resumen de Hallazgos</Title>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card size="small">
          <Text type="secondary">Total Hallazgos</Text>
          <Title level={3}>{summary.totalFindings}</Title>
        </Card>
        <Card size="small" className="border-red-200">
          <Text type="secondary">Críticos</Text>
          <Title level={3} className="text-red-500">{summary.critical}</Title>
        </Card>
        <Card size="small" className="border-orange-200">
          <Text type="secondary">Mayores</Text>
          <Title level={3} className="text-orange-500">{summary.major}</Title>
        </Card>
        <Card size="small" className="border-yellow-200">
          <Text type="secondary">Menores</Text>
          <Title level={3} className="text-yellow-500">{summary.minor}</Title>
        </Card>
      </div>

      <Table
        columns={findingsColumns}
        dataSource={findings}
        rowKey="id"
        pagination={false}
        className="mb-6"
      />

      <Divider />

      <Title level={4}>Conclusiones y Recomendaciones</Title>
      <Alert
        message={`Conclusión: ${getConclusion()}`}
        type={conclusionColor[getConclusion()]}
        showIcon
        className="mb-4"
      />
      <Paragraph>
        {audit?.conclusions || 'Basado en los hallazgos de la auditoría, se recomienda...'}
      </Paragraph>

      <Divider />

      <div className="text-right">
        <Space>
          <Button icon={<PrinterOutlined />}>Imprimir</Button>
          <Button icon={<MailOutlined />}>Enviar por Email</Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={onExport}>
            Exportar PDF
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default AuditReport;