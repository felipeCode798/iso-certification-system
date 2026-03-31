// src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import { Row, Col, Card, Statistic, Progress, List, Tag, Timeline } from 'antd';
import { FileTextOutlined, SafetyOutlined, AlertOutlined, AuditOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockDashboardStats } from '../../utils/mockData';

const Dashboard = () => {
  const { documents, risks, incidents, audits, compliance, recentIncidents, upcomingAudits, kpiData } = mockDashboardStats;

  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Gestión ISO</h1>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Documentos Controlados" value={documents} prefix={<FileTextOutlined />} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Riesgos Identificados" value={risks} prefix={<SafetyOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Incidentes Activos" value={incidents} prefix={<AlertOutlined />} valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Auditorías Realizadas" value={audits} prefix={<AuditOutlined />} valueStyle={{ color: '#722ed1' }} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="Evolución del Cumplimiento">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cumplimiento" stroke="#1890ff" name="% Cumplimiento" />
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

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Incidentes Recientes">
            <List dataSource={recentIncidents} renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={item.title} description={`Fecha: ${item.date}`} />
                <Tag color={item.status === 'resuelto' ? 'green' : item.status === 'en progreso' ? 'blue' : 'orange'}>{item.status.toUpperCase()}</Tag>
              </List.Item>
            )} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Próximas Auditorías">
            <Timeline items={upcomingAudits.map(audit => ({ color: 'blue', children: (<><p className="font-semibold">{audit.name}</p><p className="text-sm text-gray-500">{audit.date}</p><Tag color="processing">{audit.status}</Tag></>) }))} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={24}>
          <Card title="Nivel de Cumplimiento por Norma">
            <Row gutter={[16, 16]}>
              <Col span={8}><Progress percent={compliance.iso9001} status="active" strokeColor="#1890ff" format={percent => `ISO 9001: ${percent}%`} /></Col>
              <Col span={8}><Progress percent={compliance.iso27001} status="active" strokeColor="#52c41a" format={percent => `ISO 27001: ${percent}%`} /></Col>
              <Col span={8}><Progress percent={compliance.iso20000} status="active" strokeColor="#722ed1" format={percent => `ISO 20000: ${percent}%`} /></Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;