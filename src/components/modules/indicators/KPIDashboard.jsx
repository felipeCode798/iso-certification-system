// src/components/modules/indicators/KPIDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Tag, Select, DatePicker, Spin, Empty } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetDashboardQuery, useGetKPIsQuery, useGetTrendsQuery } from '../../../services/api/indicatorsService';
import dayjs from 'dayjs';

const KPIDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  
  const { data: dashboardData, isLoading: dashboardLoading } = useGetDashboardQuery();
  const { data: kpisData, isLoading: kpisLoading } = useGetKPIsQuery();
  
  const dashboard = dashboardData?.data || dashboardData || { kpis: [], compliance: {} };
  const kpis = kpisData?.data || kpisData || [];

  // Datos para el gráfico de cumplimiento por norma
  const complianceData = [
    { name: 'ISO 9001', cumplimiento: dashboard.compliance?.iso9001 || 0, objetivo: 90 },
    { name: 'ISO 27001', cumplimiento: dashboard.compliance?.iso27001 || 0, objetivo: 90 },
    { name: 'ISO 20000', cumplimiento: dashboard.compliance?.iso20000 || 0, objetivo: 90 },
  ];

  // Datos para el gráfico de torta
  const pieData = [
    { name: 'En Verde', value: dashboard.summary?.green || 0, color: '#52c41a' },
    { name: 'En Amarillo', value: dashboard.summary?.yellow || 0, color: '#faad14' },
    { name: 'En Rojo', value: dashboard.summary?.red || 0, color: '#f5222d' },
  ];

  // Tarjetas principales de KPIs
  const kpiCards = dashboard.kpis?.slice(0, 4).map(kpi => ({
    id: kpi.id,
    title: kpi.name,
    value: kpi.currentValue || 0,
    target: kpi.target,
    unit: kpi.unit,
    percentage: kpi.percentage || 0,
    status: kpi.status,
  })) || [];

  // Tabla de detalle de KPIs
  const kpiTableData = dashboard.kpis?.map(kpi => ({
    key: kpi.id,
    kpi: kpi.name,
    value: kpi.currentValue,
    target: kpi.target,
    unit: kpi.unit,
    percentage: kpi.percentage,
    status: kpi.status === 'green' ? 'success' : kpi.status === 'yellow' ? 'warning' : 'error',
    trend: kpi.percentage >= 100 ? '+✓' : kpi.percentage >= 90 ? '~' : '-⚠',
  })) || [];

  const columns = [
    { title: 'Indicador', dataIndex: 'kpi', key: 'kpi' },
    { 
      title: 'Valor Actual', 
      dataIndex: 'value', 
      key: 'value', 
      render: (val, record) => `${val || 0} ${record.unit || ''}` 
    },
    { 
      title: 'Objetivo', 
      dataIndex: 'target', 
      key: 'target', 
      render: (val, record) => `${val} ${record.unit || ''}` 
    },
    { 
      title: 'Cumplimiento', 
      dataIndex: 'percentage', 
      key: 'percentage', 
      render: (val) => <Progress percent={val || 0} size="small" /> 
    },
    { 
      title: 'Estado', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => {
        const config = {
          success: { color: 'green', text: 'En Verde' },
          warning: { color: 'orange', text: 'En Amarillo' },
          error: { color: 'red', text: 'En Rojo' },
        };
        const c = config[status] || config.warning;
        return <Tag color={c.color}>{c.text}</Tag>;
      }
    },
    { 
      title: 'Tendencia', 
      dataIndex: 'trend', 
      key: 'trend', 
      render: (trend) => {
        const icon = trend.includes('+') ? <ArrowUpOutlined /> : trend.includes('-') ? <ArrowDownOutlined /> : null;
        const color = trend.includes('+') ? 'green' : trend.includes('-') ? 'red' : 'orange';
        return <Tag color={color}>{trend}</Tag>;
      }
    },
  ];

  if (dashboardLoading || kpisLoading) {
    return (
      <div className="text-center py-12">
        <Spin size="large" />
        <p className="mt-4">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="kpi-dashboard">
      <div className="flex justify-between mb-4">
        <Select 
          defaultValue={selectedYear} 
          style={{ width: 120 }}
          onChange={setSelectedYear}
        >
          <Select.Option value={2024}>2024</Select.Option>
          <Select.Option value={2023}>2023</Select.Option>
          <Select.Option value={2022}>2022</Select.Option>
        </Select>
        <DatePicker 
          picker="month" 
          defaultValue={dayjs(selectedMonth)}
          onChange={(date) => setSelectedMonth(date?.format('YYYY-MM'))}
        />
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
                valueStyle={{ color: kpi.status === 'green' ? '#3f8600' : kpi.status === 'yellow' ? '#faad14' : '#cf1322' }}
              />
              <div className="mt-2">
                <Progress 
                  percent={kpi.percentage} 
                  size="small" 
                  strokeColor={kpi.status === 'green' ? '#52c41a' : kpi.status === 'yellow' ? '#faad14' : '#f5222d'} 
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Objetivo: {kpi.target}{kpi.unit}</span>
                  <span className={`text-xs ${kpi.percentage >= 100 ? 'text-green-500' : kpi.percentage >= 90 ? 'text-orange-500' : 'text-red-500'}`}>
                    {kpi.percentage >= 100 ? <ArrowUpOutlined /> : kpi.percentage >= 90 ? null : <ArrowDownOutlined />} 
                    {Math.abs(kpi.percentage - 100)}%
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="Cumplimiento por Norma">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cumplimiento" fill="#1890ff" name="Cumplimiento %" />
                <Bar dataKey="objetivo" fill="#52c41a" name="Objetivo %" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Distribución de Estado de KPIs">
            {pieData.filter(d => d.value > 0).length === 0 ? (
              <Empty description="No hay datos de KPIs" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={pieData} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    label={entry => `${entry.name}: ${entry.value}`} 
                    outerRadius={80} 
                    fill="#8884d8" 
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Detalle de Indicadores">
        <Table 
          columns={columns} 
          dataSource={kpiTableData} 
          rowKey="key" 
          pagination={false}
          loading={dashboardLoading}
        />
      </Card>
    </div>
  );
};

export default KPIDashboard;