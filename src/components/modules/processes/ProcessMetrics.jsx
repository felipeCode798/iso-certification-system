import React from 'react';
import { Card, Statistic, Progress, Table, Tag, Row, Col, Empty } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const ProcessMetrics = ({ process }) => {
  if (!process) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Empty description="Selecciona un proceso para ver sus métricas" />
      </div>
    );
  }

  const radarData = [
    { subject: 'Eficacia',    A: process.effectiveness || 0 },
    { subject: 'Eficiencia',  A: process.efficiency    || 0 },
    { subject: 'Calidad',     A: process.quality       || 0 },
    { subject: 'Cumplimiento',A: 88 },
    { subject: 'Satisfacción',A: 85 },
  ];

  const indicators = [
    { name: 'Tiempo de ciclo',        value: '2.5 días', target: '3 días',  status: 'success', trend: '-0.5 días' },
    { name: 'Productividad',          value: `${process.effectiveness}%`, target: '90%', status: process.effectiveness >= 90 ? 'success' : 'warning', trend: '+2%' },
    { name: 'Tasa de defectos',       value: '2.3%',     target: '3%',     status: 'success', trend: '-0.7%' },
    { name: 'Cumplimiento de plazos', value: '92%',      target: '95%',    status: 'warning', trend: '-3%' },
  ];

  const columns = [
    { title: 'Indicador', dataIndex: 'name', key: 'name' },
    { title: 'Actual',    dataIndex: 'value', key: 'value', render: v => <strong>{v}</strong> },
    { title: 'Meta',      dataIndex: 'target', key: 'target' },
    { title: 'Estado',    dataIndex: 'status', key: 'status',
      render: s => <Tag color={s === 'success' ? 'success' : 'warning'}>{s === 'success' ? '✓ Cumple' : '⚠ Alerta'}</Tag> },
    { title: 'Tendencia', dataIndex: 'trend', key: 'trend',
      render: t => <Tag icon={t.startsWith('+') ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        color={t.startsWith('+') ? 'green' : 'red'}>{t}</Tag> },
  ];

  return (
    <div>
      <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <div className="font-semibold text-blue-700">{process.code} — {process.name}</div>
        <div className="text-xs text-gray-500">Dueño: {process.owner}</div>
      </div>

      <Row gutter={[12, 12]} className="mb-4">
        {[
          { title: 'Eficacia',   value: process.effectiveness, color: '#3f8600' },
          { title: 'Eficiencia', value: process.efficiency,    color: '#1890ff' },
          { title: 'Calidad',    value: process.quality,       color: '#52c41a' },
        ].map(m => (
          <Col span={8} key={m.title}>
            <Card size="small" className="text-center">
              <Statistic title={m.title} value={m.value} suffix="%" valueStyle={{ color: m.color, fontSize: 20 }} />
              <Progress percent={m.value} size="small" strokeColor={m.color} showInfo={false} className="mt-1" />
            </Card>
          </Col>
        ))}
      </Row>

      <Card size="small" title="Radar de Desempeño" className="mb-4">
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
            <Radar name={process.name} dataKey="A" stroke="#1890ff" fill="#1890ff" fillOpacity={0.25} />
            <Tooltip formatter={v => `${v}%`} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      <Card size="small" title="Indicadores KPI">
        <Table columns={columns} dataSource={indicators} rowKey="name" pagination={false} size="small" />
      </Card>
    </div>
  );
};

export default ProcessMetrics;