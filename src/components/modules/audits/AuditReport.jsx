import React from 'react';
import { Modal, Card, Descriptions, Table, Tag, Button, Space, Typography, Divider, Alert, Row, Col, Statistic, Progress, Spin } from 'antd';
import { DownloadOutlined, PrinterOutlined, MailOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useGetAuditReportQuery } from '../../../services/api/auditsService';
import * as XLSX from 'xlsx';

const { Title, Paragraph, Text } = Typography;

const AuditReport = ({ visible, onClose, auditId }) => {
  const { data: reportData, isLoading, error } = useGetAuditReportQuery(auditId, {
    enabled: visible && !!auditId,
  });

  if (!visible) return null;

  const report = reportData?.data || reportData;

  if (isLoading) {
    return (
      <Modal open={visible} onCancel={onClose} footer={null} width={1000}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p className="mt-4">Cargando informe...</p>
        </div>
      </Modal>
    );
  }

  if (error || !report) {
    return (
      <Modal open={visible} onCancel={onClose} footer={null} width={1000}>
        <Alert 
          message="Error al cargar el informe" 
          description={error?.message || 'No se pudo generar el informe'} 
          type="error" 
          showIcon 
        />
      </Modal>
    );
  }

  const { audit, findings = [], checklist = [], summary = {}, score = 0 } = report;

  const getConclusion = () => {
    const scoreNum = parseFloat(score);
    if (scoreNum >= 90) return { text: 'Aprobada', type: 'success', icon: <CheckCircleOutlined /> };
    if (scoreNum >= 70) return { text: 'Aprobada con Observaciones', type: 'warning', icon: <WarningOutlined /> };
    return { text: 'No Aprobada', type: 'error', icon: <CloseCircleOutlined /> };
  };

  const conclusion = getConclusion();

  const findingsColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Hallazgo', dataIndex: 'description', key: 'description' },
    { 
      title: 'Severidad', 
      dataIndex: 'severity', 
      key: 'severity', 
      width: 100,
      render: (severity) => {
        const colors = { critical: 'red', major: 'orange', minor: 'yellow', observation: 'blue' };
        return <Tag color={colors[severity]}>{severity?.toUpperCase()}</Tag>;
      }
    },
    { title: 'Cláusula', dataIndex: 'clause', key: 'clause', width: 100 },
    { title: 'Acción Requerida', dataIndex: 'requiredAction', key: 'requiredAction' },
    { title: 'Responsable', dataIndex: 'responsible', key: 'responsible', width: 120 },
    { 
      title: 'Estado', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status) => <Tag color={status === 'closed' ? 'green' : 'red'}>{status === 'closed' ? 'Cerrado' : 'Abierto'}</Tag> 
    },
  ];

  const handleExportExcel = () => {
    const exportData = findings.map(f => ({
      ID: f.id,
      Hallazgo: f.description,
      Severidad: f.severity,
      Cláusula: f.clause,
      Requisito: f.requirement,
      'Acción Requerida': f.requiredAction,
      Responsable: f.responsible,
      Estado: f.status,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hallazgos');
    XLSX.writeFile(wb, `Auditoria_${audit?.id}_${new Date().toISOString()}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      title={`Informe de Auditoría - ${audit?.name}`}
    >
      <div className="audit-report">
        <div className="text-center mb-6">
          <Title level={2}>Informe de Auditoría</Title>
          <Text type="secondary">Sistema de Gestión Integrado ISO</Text>
          <Divider />
          <Title level={4}>{audit?.name}</Title>
          <Text type="secondary">
            {audit?.standard === 'iso9001' ? 'ISO 9001:2015 - Calidad' : 
             audit?.standard === 'iso27001' ? 'ISO 27001:2022 - Seguridad' : 
             'ISO 20000:2018 - Servicios TI'}
          </Text>
        </div>

        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Código Auditoría">{audit?.auditCode}</Descriptions.Item>
          <Descriptions.Item label="Tipo">{audit?.type?.toUpperCase()}</Descriptions.Item>
          <Descriptions.Item label="Fecha Auditoría">{audit?.auditDate}</Descriptions.Item>
          <Descriptions.Item label="Duración">{audit?.duration} días</Descriptions.Item>
          <Descriptions.Item label="Auditor Líder">{audit?.auditor}</Descriptions.Item>
          <Descriptions.Item label="Equipo Auditor">{audit?.auditTeam?.join(', ')}</Descriptions.Item>
          <Descriptions.Item label="Ubicación">{audit?.location}</Descriptions.Item>
          <Descriptions.Item label="Departamento">{audit?.department}</Descriptions.Item>
          <Descriptions.Item label="Alcance" span={2}>{audit?.scope}</Descriptions.Item>
          <Descriptions.Item label="Objetivos" span={2}>{audit?.objectives}</Descriptions.Item>
          <Descriptions.Item label="Criterios" span={2}>{audit?.criteria?.join(', ')}</Descriptions.Item>
        </Descriptions>

        <Divider />

        <Title level={4}>Resumen Ejecutivo</Title>
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card size="small">
              <Statistic title="Total Hallazgos" value={summary.totalFindings || 0} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Críticos" value={summary.critical || 0} valueStyle={{ color: '#cf1322' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Mayores" value={summary.major || 0} valueStyle={{ color: '#faad14' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic title="Menores" value={summary.minor || 0} valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} className="mb-6">
          <Col span={12}>
            <Card size="small">
              <Statistic title="Puntaje de Cumplimiento" value={score} suffix="%" />
              <Progress percent={parseFloat(score)} strokeColor={parseFloat(score) >= 90 ? '#52c41a' : parseFloat(score) >= 70 ? '#faad14' : '#f5222d'} />
            </Card>
          </Col>
          <Col span={12}>
            <Alert 
              message={`Conclusión: ${conclusion.text}`} 
              type={conclusion.type} 
              showIcon 
              icon={conclusion.icon} 
            />
          </Col>
        </Row>

        {findings.length > 0 && (
          <>
            <Title level={4}>Hallazgos de Auditoría</Title>
            <Table 
              columns={findingsColumns} 
              dataSource={findings} 
              rowKey="id" 
              pagination={false} 
              size="small"
              className="mb-6" 
              scroll={{ x: 1000 }}
            />
          </>
        )}

        {checklist.length > 0 && (
          <>
            <Title level={4}>Resumen de Verificación</Title>
            <Progress percent={(summary.compliant / (summary.compliant + summary.nonCompliant)) * 100 || 0} />
            <div className="mt-4">
              <Tag color="green">Cumple: {summary.compliant || 0}</Tag>
              <Tag color="red">No Cumple: {summary.nonCompliant || 0}</Tag>
            </div>
          </>
        )}

        <Divider />

        <Title level={4}>Recomendaciones y Plan de Acción</Title>
        <Paragraph>
          {audit?.conclusions || 'Basado en los hallazgos de la auditoría, se recomienda implementar las acciones correctivas descritas en el plazo establecido.'}
        </Paragraph>

        <Title level={4}>Aprobaciones</Title>
        <Row gutter={16} className="mt-4">
          <Col span={12}>
            <div className="border-t pt-2">
              <Text type="secondary">Auditor Líder</Text>
              <div className="mt-2">{audit?.auditor}</div>
              <div className="text-sm text-gray-400">Fecha: {new Date().toLocaleDateString()}</div>
            </div>
          </Col>
          <Col span={12}>
            <div className="border-t pt-2">
              <Text type="secondary">Representante de la Dirección</Text>
              <div className="mt-2">_________________________</div>
            </div>
          </Col>
        </Row>

        <Divider />

        <div className="text-right">
          <Space>
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>Imprimir</Button>
            <Button icon={<MailOutlined />}>Enviar por Email</Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportExcel}>Exportar Excel</Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default AuditReport;