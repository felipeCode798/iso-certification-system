// src/components/modules/indicators/KPIReports.jsx
import React, { useState, useEffect } from 'react';
import { Card, Select, DatePicker, Button, Table, Space, Progress, Tag, Row, Col, Statistic, message, Spin } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileExcelOutlined, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetKPIsQuery, useGetTrendsQuery, useExportKPIDataQuery } from '../../../services/api/indicatorsService';
import dayjs from 'dayjs';

const KPIReports = () => {
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [dateRange, setDateRange] = useState([dayjs().subtract(6, 'month'), dayjs()]);
  const [months, setMonths] = useState(6);
  
  const { data: kpisData, isLoading: kpisLoading } = useGetKPIsQuery();
  const { data: trendsData, isLoading: trendsLoading, refetch: refetchTrends } = useGetTrendsQuery(selectedKPI, months);
  
  const kpis = kpisData?.data || kpisData || [];
  const trends = trendsData?.data || trendsData || [];
  
  // Opciones para el selector de KPI
  const kpiOptions = kpis.map(kpi => ({
    value: kpi.id,
    label: `${kpi.code} - ${kpi.name}`,
    target: kpi.target,
    unit: kpi.unit,
  }));

  const selectedKpiInfo = kpiOptions.find(k => k.value === selectedKPI);

  // Calcular estadísticas del KPI seleccionado
  const summaryStats = trends.length > 0 ? {
    average: (trends.reduce((sum, t) => sum + (t.value || 0), 0) / trends.filter(t => t.value !== null).length).toFixed(1),
    min: Math.min(...trends.filter(t => t.value !== null).map(t => t.value)),
    max: Math.max(...trends.filter(t => t.value !== null).map(t => t.value)),
    current: trends[trends.length - 1]?.value || 0,
    target: selectedKpiInfo?.target || 0,
    compliance: trends.length > 0 ? (trends[trends.length - 1]?.value / selectedKpiInfo?.target) * 100 : 0,
  } : null;

  const columns = [
    { title: 'Período', dataIndex: 'period', key: 'period' },
    { 
      title: 'Valor Alcanzado', 
      dataIndex: 'value', 
      key: 'value', 
      render: (val, record) => `${val || 'N/A'} ${selectedKpiInfo?.unit || ''}` 
    },
    { 
      title: 'Meta', 
      dataIndex: 'target', 
      key: 'target', 
      render: () => `${selectedKpiInfo?.target || 0} ${selectedKpiInfo?.unit || ''}` 
    },
    { 
      title: 'Cumplimiento', 
      key: 'compliance', 
      render: (_, record) => {
        const percent = record.value ? (record.value / selectedKpiInfo?.target) * 100 : 0;
        return <Progress percent={percent} size="small" />;
      }
    },
    { 
      title: 'Estado', 
      key: 'status', 
      render: (_, record) => {
        const percent = record.value ? (record.value / selectedKpiInfo?.target) * 100 : 0;
        const status = percent >= 100 ? 'green' : percent >= 90 ? 'orange' : 'red';
        const text = percent >= 100 ? 'Cumple' : percent >= 90 ? 'Alerta' : 'No Cumple';
        return <Tag color={status}>{text}</Tag>;
      }
    },
  ];

  const handleKPISelect = (value) => {
    setSelectedKPI(value);
    setTimeout(() => refetchTrends(), 100);
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      const monthsDiff = dates[1].diff(dates[0], 'month');
      setMonths(monthsDiff + 1);
      setDateRange(dates);
      setTimeout(() => refetchTrends(), 100);
    }
  };

  const handleExport = async (format) => {
    if (!selectedKPI) {
      message.warning('Seleccione un KPI primero');
      return;
    }
    message.info(`Exportando en formato ${format.toUpperCase()}...`);
    // Aquí iría la lógica de exportación
  };

  if (kpisLoading) {
    return (
      <Card>
        <div className="text-center py-12">
          <Spin size="large" />
          <p className="mt-4">Cargando KPIs...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="kpi-reports">
      <Card>
        <div className="flex flex-wrap gap-4 mb-6">
          <Select
            placeholder="Seleccionar KPI"
            options={kpiOptions}
            style={{ width: 300 }}
            onChange={handleKPISelect}
            showSearch
            optionFilterProp="label"
          />
          <DatePicker.RangePicker 
            onChange={handleDateRangeChange}
            value={dateRange}
            picker="month"
          />
          <Space>
            <Button icon={<FilePdfOutlined />} onClick={() => handleExport('pdf')}>PDF</Button>
            <Button icon={<FileExcelOutlined />} onClick={() => handleExport('excel')}>Excel</Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Imprimir</Button>
            <Button icon={<ReloadOutlined />} onClick={() => refetchTrends()}>Actualizar</Button>
          </Space>
        </div>

        {!selectedKPI ? (
          <div className="text-center py-12">
            <p>Seleccione un KPI para visualizar sus reportes</p>
          </div>
        ) : trendsLoading ? (
          <div className="text-center py-12">
            <Spin size="large" />
            <p className="mt-4">Cargando datos del KPI...</p>
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]} className="mb-6">
              <Col span={6}>
                <Card size="small">
                  <Statistic 
                    title="Valor Actual" 
                    value={summaryStats?.current || 0} 
                    suffix={selectedKpiInfo?.unit}
                    valueStyle={{ color: summaryStats?.compliance >= 100 ? '#3f8600' : '#cf1322' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic 
                    title="Promedio" 
                    value={summaryStats?.average || 0} 
                    suffix={selectedKpiInfo?.unit}
                    precision={1}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="Mínimo" value={summaryStats?.min || 0} suffix={selectedKpiInfo?.unit} />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="Máximo" value={summaryStats?.max || 0} suffix={selectedKpiInfo?.unit} />
                </Card>
              </Col>
            </Row>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Evolución del KPI</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#1890ff" 
                    name="Valor Alcanzado" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#52c41a" 
                    name="Meta" 
                    strokeDasharray="5 5" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Detalle por Período</h3>
              <Table 
                columns={columns} 
                dataSource={trends} 
                rowKey="period" 
                pagination={false}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default KPIReports;