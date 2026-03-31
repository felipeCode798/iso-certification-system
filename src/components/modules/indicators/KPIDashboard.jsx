// src/components/modules/indicators/KPIDashboard.jsx
import React from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Tag, Select, DatePicker } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KPIDashboard = () => {
  const complianceData = [
    { month: 'Ene', cumplimiento: 85, objetivo: 90 },
    { month: 'Feb', cumplimiento: 88, objetivo: 90 },
    { month: 'Mar', cumplimiento: 92, objetivo: 90 },
    { month: 'Abr', cumplimiento: 90, objetivo: 90 },
    { month: 'May', cumplimiento: 94, objetivo: 90 },
    { month: 'Jun', cumplimiento: 96, objetivo: 90 },
  ];

  const kpiCards = [
    { title: 'Cumplimiento ISO 9001', value: 94, target: 90, unit: '%', trend: 4, status: 'success' },
    { title: 'Cumplimiento ISO 27001', value: 88, target: 90, unit: '%', trend: -2, status: 'warning' },
    { title: 'Cumplimiento ISO 20000', value: 91, target: 90, unit: '%', trend: 1, status: 'success' },
    { title: 'Satisfacción del Cliente', value: 8.5, target: 9, unit: '/10', trend: 0.3, status: 'success' },
  ];

  const pieData = [
    { name: 'Cumple', value: 85, color: '#52c41a' },
    { name: 'No Cumple', value: 15, color: '#f5222d' },
  ];

  const kpiTableData = [
    { kpi: 'Eficacia de Procesos', value: 92, target: 85, status: 'success', trend: '+7%' },
    { kpi: 'Tiempo de Respuesta a Incidentes', value: 4.2, target: 4, unit: 'horas', status: 'warning', trend: '+0.2h' },
    { kpi: 'Auditorías Completadas', value: 12, target: 10, status: 'success', trend: '+2' },
    { kpi: 'No Conformidades Cerradas', value: 85, target: 90, unit: '%', status: 'warning', trend: '-5%' },
  ];

  const columns = [
    { title: 'Indicador', dataIndex: 'kpi', key: 'kpi' },
    { title: 'Valor Actual', dataIndex: 'value', key: 'value', render: (val, record) => `${val} ${record.unit || ''}` },
    { title: 'Objetivo', dataIndex: 'target', key: 'target', render: (val, record) => `${val} ${record.unit || ''}` },
    { title: 'Estado', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'success' ? 'green' : 'orange'}>{status === 'success' ? 'En Verde' : 'En Amarillo'}</Tag> },
    { title: 'Tendencia', dataIndex: 'trend', key: 'trend', render: (trend) => <Tag icon={trend.includes('+') ? <ArrowUpOutlined /> : <ArrowDownOutlined />} color={trend.includes('+') ? 'green' : 'red'}>{trend}</Tag> },
  ];

  return (
    <div className="kpi-dashboard">
      <div className="flex justify-between mb-4">
        <Select defaultValue="2024" style={{ width: 120 }}>
          <Select.Option value="2024">2024</Select.Option>
          <Select.Option value="2023">2023</Select.Option>
        </Select>
        <DatePicker picker="month" />
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        {kpiCards.map((kpi, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={kpi.title}
                value={kpi.value}
                suffix={kpi.unit}
                precision={kpi.title.includes('Satisfacción') ? 1 : 0}
                valueStyle={{ color: kpi.status === 'success' ? '#3f8600' : '#cf1322' }}
              />
              <div className="mt-2">
                <Progress percent={(kpi.value / kpi.target) * 100} size="small" 
                  strokeColor={kpi.status === 'success' ? '#52c41a' : '#faad14'} />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Objetivo: {kpi.target}{kpi.unit}</span>
                  <span className={`text-xs ${kpi.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {kpi.trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(kpi.trend)}{kpi.unit}
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="Evolución del Cumplimiento">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cumplimiento" stroke="#1890ff" name="Cumplimiento %" />
                <Line type="monotone" dataKey="objetivo" stroke="#52c41a" name="Objetivo %" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Distribución de Cumplimiento">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={entry => `${entry.name}: ${entry.value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Detalle de Indicadores">
        <Table columns={columns} dataSource={kpiTableData} rowKey="kpi" pagination={false} />
      </Card>
    </div>
  );
};

export default KPIDashboard;