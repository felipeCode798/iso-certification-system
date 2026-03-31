// src/components/modules/indicators/KPIReports.jsx
import React, { useState } from 'react';
import { Card, Select, DatePicker, Button, Table, Space, Progress, Tag, Row, Col, Statistic } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KPIReports = () => {
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  const kpiOptions = [
    { value: 'kpi1', label: 'Cumplimiento de Auditorías' },
    { value: 'kpi2', label: 'Tiempo de Respuesta a Incidentes' },
    { value: 'kpi3', label: 'Satisfacción del Cliente' },
  ];

  const historicalData = [
    { month: 'Ene', value: 85, target: 90 },
    { month: 'Feb', value: 88, target: 90 },
    { month: 'Mar', value: 92, target: 90 },
    { month: 'Abr', value: 90, target: 90 },
    { month: 'May', value: 94, target: 90 },
    { month: 'Jun', value: 96, target: 90 },
  ];

  const summaryStats = {
    average: 90.8,
    min: 85,
    max: 96,
    trend: '+11%',
    compliance: 94,
  };

  const columns = [
    { title: 'Período', dataIndex: 'month', key: 'month' },
    { title: 'Valor Alcanzado', dataIndex: 'value', key: 'value', render: (val) => `${val}%` },
    { title: 'Meta', dataIndex: 'target', key: 'target', render: (val) => `${val}%` },
    { title: 'Cumplimiento', key: 'compliance', render: (_, record) => <Progress percent={(record.value / record.target) * 100} size="small" /> },
    { title: 'Estado', key: 'status', render: (_, record) => <Tag color={record.value >= record.target ? 'green' : 'orange'}>{record.value >= record.target ? 'Cumple' : 'No Cumple'}</Tag> },
  ];

  const handleExport = (format) => {
    console.log(`Exportando en formato ${format}`);
  };

  return (
    <div className="kpi-reports">
      <Card>
        <div className="flex flex-wrap gap-4 mb-6">
          <Select
            placeholder="Seleccionar KPI"
            options={kpiOptions}
            style={{ width: 250 }}
            onChange={setSelectedKPI}
          />
          <DatePicker.RangePicker onChange={setDateRange} />
          <Space>
            <Button icon={<FilePdfOutlined />} onClick={() => handleExport('pdf')}>PDF</Button>
            <Button icon={<FileExcelOutlined />} onClick={() => handleExport('excel')}>Excel</Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Imprimir</Button>
            <Button type="primary" icon={<DownloadOutlined />}>Descargar Reporte</Button>
          </Space>
        </div>

        <Row gutter={[16, 16]} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic title="Promedio" value={summaryStats.average} suffix="%" precision={1} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Mínimo" value={summaryStats.min} suffix="%" />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Máximo" value={summaryStats.max} suffix="%" />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Tendencia" value={summaryStats.trend} />
            </Card>
          </Col>
        </Row>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Evolución del KPI</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#1890ff" name="Valor Alcanzado" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="#52c41a" name="Meta" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Detalle por Período</h3>
          <Table columns={columns} dataSource={historicalData} rowKey="month" />
        </div>
      </Card>
    </div>
  );
};

export default KPIReports;