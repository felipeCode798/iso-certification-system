import React from 'react';
import { Card, Statistic, Progress, Table, Tag, Row, Col, Empty, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useGetProcessMetricsQuery } from '../../../services/api/processesService';

const ProcessMetrics = ({ process }) => {
  const { data: metrics, isLoading, error } = useGetProcessMetricsQuery(process?.id, {
    enabled: !!process?.id,
  });

  if (!process) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Empty description="Selecciona un proceso para ver sus métricas" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Cargando métricas..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <Empty description="Error al cargar las métricas" />
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  // Usar datos reales del backend o los del proceso seleccionado
  const processData = metrics || process;

  const radarData = [
    { subject: 'Eficacia', A: processData.effectiveness || 0 },
    { subject: 'Eficiencia', A: processData.efficiency || 0 },
    { subject: 'Calidad', A: processData.quality || 0 },
    { subject: 'Cumplimiento', A: processData.compliance || 85 },
    { subject: 'Satisfacción', A: processData.satisfaction || 82 },
  ];

  // Calcular tendencias basadas en datos reales
  const getTrend = (current, target) => {
    const diff = current - target;
    if (diff > 0) return { text: `+${diff}%`, color: 'green', icon: <ArrowUpOutlined /> };
    if (diff < 0) return { text: `${diff}%`, color: 'red', icon: <ArrowDownOutlined /> };
    return { text: '0%', color: 'gray', icon: null };
  };

  const effectivenessTrend = getTrend(processData.effectiveness, 90);
  const efficiencyTrend = getTrend(processData.efficiency, 85);
  const qualityTrend = getTrend(processData.quality, 95);

  const indicators = [
    { 
      name: 'Eficacia', 
      value: `${processData.effectiveness || 0}%`, 
      target: '90%', 
      status: (processData.effectiveness || 0) >= 90 ? 'success' : 'warning',
      trend: effectivenessTrend.text,
      trendIcon: effectivenessTrend.icon,
      trendColor: effectivenessTrend.color,
    },
    { 
      name: 'Eficiencia', 
      value: `${processData.efficiency || 0}%`, 
      target: '85%', 
      status: (processData.efficiency || 0) >= 85 ? 'success' : 'warning',
      trend: efficiencyTrend.text,
      trendIcon: efficiencyTrend.icon,
      trendColor: efficiencyTrend.color,
    },
    { 
      name: 'Calidad', 
      value: `${processData.quality || 0}%`, 
      target: '95%', 
      status: (processData.quality || 0) >= 95 ? 'success' : 'warning',
      trend: qualityTrend.text,
      trendIcon: qualityTrend.icon,
      trendColor: qualityTrend.color,
    },
    { 
      name: 'Tiempo de Ciclo', 
      value: processData.cycleTime || '2.5 días', 
      target: '3 días', 
      status: 'success', 
      trend: '-0.5 días',
      trendIcon: <ArrowDownOutlined />,
      trendColor: 'green',
    },
    { 
      name: 'Cumplimiento de Plazos', 
      value: `${processData.deadlineCompliance || 92}%`, 
      target: '95%', 
      status: (processData.deadlineCompliance || 92) >= 95 ? 'success' : 'warning',
      trend: `${(processData.deadlineCompliance || 92) - 95}%`,
      trendIcon: <ArrowDownOutlined />,
      trendColor: 'red',
    },
  ];

  const columns = [
    { title: 'Indicador', dataIndex: 'name', key: 'name', width: 180 },
    { title: 'Actual', dataIndex: 'value', key: 'value', render: v => <strong>{v}</strong> },
    { title: 'Meta', dataIndex: 'target', key: 'target' },
    { 
      title: 'Estado', 
      dataIndex: 'status', 
      key: 'status',
      render: s => <Tag color={s === 'success' ? 'success' : 'warning'}>{s === 'success' ? '✓ Cumple' : '⚠ Alerta'}</Tag> 
    },
    { 
      title: 'Tendencia', 
      dataIndex: 'trend', 
      key: 'trend',
      render: (text, record) => (
        <Tag icon={record.trendIcon} color={record.trendColor}>
          {text}
        </Tag>
      )
    },
  ];

  return (
    <div>
      <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <div className="font-semibold text-blue-700">{processData.code} — {processData.name}</div>
        <div className="text-xs text-gray-500">Dueño: {processData.owner}</div>
      </div>

      <Row gutter={[12, 12]} className="mb-4">
        {[
          { title: 'Eficacia', value: processData.effectiveness || 0, color: '#3f8600' },
          { title: 'Eficiencia', value: processData.efficiency || 0, color: '#1890ff' },
          { title: 'Calidad', value: processData.quality || 0, color: '#52c41a' },
        ].map(m => (
          <Col span={8} key={m.title}>
            <Card size="small" className="text-center">
              <Statistic 
                title={m.title} 
                value={m.value} 
                suffix="%" 
                valueStyle={{ color: m.color, fontSize: 20 }} 
              />
              <Progress 
                percent={m.value} 
                size="small" 
                strokeColor={m.value >= 90 ? '#52c41a' : m.value >= 75 ? '#faad14' : '#ff4d4f'} 
                showInfo={false} 
                className="mt-1" 
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card size="small" title="Radar de Desempeño" className="mb-4">
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
            <Radar 
              name={processData.name} 
              dataKey="A" 
              stroke="#1890ff" 
              fill="#1890ff" 
              fillOpacity={0.25} 
            />
            <Tooltip formatter={v => `${v}%`} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      <Card size="small" title="Indicadores KPI">
        <Table 
          columns={columns} 
          dataSource={indicators} 
          rowKey="name" 
          pagination={false} 
          size="small" 
        />
      </Card>
    </div>
  );
};

export default ProcessMetrics;