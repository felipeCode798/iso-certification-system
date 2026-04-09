// src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import { Row, Col, Card, Statistic, Progress, List, Tag, Timeline, Spin, Alert, Button } from 'antd';
import { FileTextOutlined, SafetyOutlined, AlertOutlined, AuditOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetDashboardQuery } from '../../services/api/dashboardService';

const Dashboard = () => {
  const { data, isLoading, error, refetch } = useGetDashboardQuery();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="Cargando datos del dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error al cargar el dashboard"
        description={error.message || 'Hubo un problema al cargar los datos'}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => refetch()}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const {
    documents = 0,
    risks = 0,
    incidents = 0,
    audits = 0,
    compliance = { iso9001: 0, iso27001: 0, iso20000: 0 },
    recentIncidents = [],
    upcomingAudits = [],
    kpiData = [],
  } = data || {};

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Dashboard de Gestión ISO</h1>
      
      {/* Métricas Principales */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Documentos Controlados" value={documents} prefix={<FileTextOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Riesgos Identificados" value={risks} prefix={<SafetyOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Incidentes Activos" value={incidents} prefix={<AlertOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Auditorías Realizadas" value={audits} prefix={<AuditOutlined />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Evolución del Cumplimiento">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cumplimiento" stroke="#1890ff" name="% Cumplimiento" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Auditorías por Mes">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="auditorias" fill="#52c41a" name="Nº Auditorías" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Tablas y Listados */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Incidentes Recientes">
            {recentIncidents.length > 0 ? (
              <List
                dataSource={recentIncidents}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta title={item.title} description={`Fecha: ${item.date}`} />
                    <Tag color={item.status === 'resolved' ? 'green' : item.status === 'inProgress' ? 'blue' : 'orange'}>
                      {item.status?.toUpperCase()}
                    </Tag>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>No hay incidentes recientes</div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Próximas Auditorías">
            {upcomingAudits.length > 0 ? (
              <Timeline
                items={upcomingAudits.map(audit => ({
                  color: 'blue',
                  children: (
                    <>
                      <p style={{ fontWeight: 'bold', margin: 0 }}>{audit.name}</p>
                      <p style={{ fontSize: '12px', color: '#666', margin: '4px 0' }}>{audit.date}</p>
                      <Tag color="processing">{audit.status}</Tag>
                    </>
                  )
                }))}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>No hay auditorías programadas</div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Indicadores de Cumplimiento ISO */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Nivel de Cumplimiento por Norma">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Progress percent={compliance.iso9001} status="active" strokeColor="#1890ff" format={percent => `ISO 9001: ${percent}%`} />
              </Col>
              <Col span={8}>
                <Progress percent={compliance.iso27001} status="active" strokeColor="#52c41a" format={percent => `ISO 27001: ${percent}%`} />
              </Col>
              <Col span={8}>
                <Progress percent={compliance.iso20000} status="active" strokeColor="#722ed1" format={percent => `ISO 20000: ${percent}%`} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;