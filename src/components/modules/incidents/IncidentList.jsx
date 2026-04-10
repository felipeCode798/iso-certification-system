import React, { useState } from 'react';
import { Table, Tag, Button, Space, Badge, Tooltip, Progress, Input, Modal, Row, Col, Statistic, Spin } from 'antd';
import {
  EyeOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, PlusOutlined, FireOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import IncidentDetail from './IncidentDetail';
import { useIncidentStatisticsQuery } from '../../../services/api/incidentsService';

const severityConfig = {
  critical: { color: 'red',    label: 'Crítico'  },
  high:     { color: 'orange', label: 'Alto'     },
  medium:   { color: 'gold',   label: 'Medio'    },
  low:      { color: 'green',  label: 'Bajo'     },
};

const statusConfig = {
  open:       { badge: 'error',   label: 'Abierto'     },
  inProgress: { badge: 'warning', label: 'En Progreso' },
  resolved:   { badge: 'success', label: 'Resuelto'    },
  closed:     { badge: 'default', label: 'Cerrado'     },
};

const categoryColors = {
  technical: 'cyan', process: 'blue', security: 'red', service: 'purple', quality: 'green',
};

const IncidentList = ({ incidents = [], loading, onEdit, onDelete, onNew, onResolve }) => {
  const [search, setSearch] = useState('');
  const [viewIncident, setViewIncident] = useState(null);
  
  // Obtener estadísticas REALES del backend
  const { data: stats, isLoading: statsLoading } = useIncidentStatisticsQuery();

  const filtered = incidents.filter(i =>
    i.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.reportedBy?.toLowerCase().includes(search.toLowerCase()) ||
    i.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (record) => {
    Modal.confirm({
      title: '¿Eliminar incidente?',
      content: `Se eliminará "${record.title}". Esta acción no se puede deshacer.`,
      okText: 'Eliminar', 
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: () => onDelete(record.id),
    });
  };

  const handleGoToResolution = (incident) => {
    setViewIncident(null);
    onResolve?.(incident);
  };

  const columns = [
    {
      title: 'Incidente', 
      dataIndex: 'title', 
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title, r) => (
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-gray-400">
            {r.reportedBy || '—'} · {r.reportedDate ? new Date(r.reportedDate).toLocaleDateString() : '—'}
          </div>
        </div>
      ),
    },
    {
      title: 'Severidad', 
      dataIndex: 'severity', 
      key: 'severity', 
      width: 100,
      render: s => { const c = severityConfig[s]; return <Tag color={c?.color}>{c?.label}</Tag>; },
      filters: Object.entries(severityConfig).map(([v, c]) => ({ text: c.label, value: v })),
      onFilter: (v, r) => r.severity === v,
      sorter: (a, b) => {
        const order = { critical: 4, high: 3, medium: 2, low: 1 };
        return (order[b.severity] || 0) - (order[a.severity] || 0);
      },
    },
    {
      title: 'Estado', 
      dataIndex: 'status', 
      key: 'status', 
      width: 130,
      render: s => { const c = statusConfig[s]; return <Badge status={c?.badge} text={c?.label} />; },
      filters: Object.entries(statusConfig).map(([v, c]) => ({ text: c.label, value: v })),
      onFilter: (v, r) => r.status === v,
    },
    {
      title: 'Categoría', 
      dataIndex: 'category', 
      key: 'category', 
      width: 110,
      render: cat => <Tag color={categoryColors[cat]}>{cat}</Tag>,
    },
    {
      title: 'Progreso', 
      dataIndex: 'progress', 
      key: 'progress', 
      width: 140,
      render: (val, r) => (
        <Tooltip title={`${val || 0}% completado`}>
          <Progress
            percent={val || 0} 
            size="small"
            status={r.status === 'resolved' ? 'success' : 'active'}
            strokeColor={val >= 75 ? '#52c41a' : val >= 40 ? '#faad14' : '#ff4d4f'}
          />
        </Tooltip>
      ),
      sorter: (a, b) => (b.progress || 0) - (a.progress || 0),
    },
    {
      title: 'SLA', 
      key: 'sla', 
      width: 80,
      render: (_, r) => {
        if (!r.slaTime) return '—';
        const pct = Math.round(((r.resolutionTime || 0) / r.slaTime) * 100);
        const ok = pct <= 100;
        return (
          <Tooltip title={`${r.resolutionTime || 0}h de ${r.slaTime}h`}>
            <Tag color={ok ? 'success' : 'error'}>{ok ? '✓ OK' : '⚠ Vencido'}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Norma', 
      dataIndex: 'standard', 
      key: 'standard', 
      width: 90,
      render: s => s ? <Tag color="geekblue">{s.toUpperCase()}</Tag> : '—',
    },
    {
      title: 'Acciones', 
      key: 'actions', 
      width: 110,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver detalle">
            <Button icon={<EyeOutlined />} size="small" onClick={() => setViewIncident(record)} />
          </Tooltip>
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} size="small" type="primary" ghost onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Mostrar loading mientras cargan estadísticas
  if (statsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Métricas rápidas desde BACKEND */}
      <Row gutter={[12, 12]} className="mb-4">
        {[
          { label: 'Total',     value: stats?.total || 0,       color: '#1890ff', icon: <ClockCircleOutlined /> },
          { label: 'Abiertos',    value: stats?.open || 0,       color: '#ff4d4f', icon: <ClockCircleOutlined /> },
          { label: 'En Progreso', value: stats?.inProgress || 0, color: '#faad14', icon: <ClockCircleOutlined /> },
          { label: 'Resueltos',   value: stats?.resolved || 0,   color: '#52c41a', icon: <CheckCircleOutlined /> },
          { label: 'Críticos',    value: stats?.critical || 0,   color: '#ff4d4f', icon: <FireOutlined /> },
        ].map(s => (
          <Col span={4} key={s.label}>
            <div className="rounded-lg p-3 border text-center" style={{ borderColor: s.color, background: s.color + '15' }}>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      <div className="flex justify-between items-center mb-3">
        <Input
          placeholder="Buscar por título, reportado por o categoría..."
          prefix={<SearchOutlined />} 
          className="w-80" 
          allowClear
          onChange={e => setSearch(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onNew}>
          Reportar Incidente
        </Button>
      </div>

      <Table
        columns={columns} 
        dataSource={filtered} 
        rowKey="id"
        loading={loading} 
        size="middle"
        pagination={{ pageSize: 8, showTotal: t => `Total: ${t} incidentes` }}
        rowClassName={r => r.severity === 'critical' && r.status !== 'closed' ? 'bg-red-50' : ''}
      />

      <IncidentDetail
        visible={!!viewIncident}
        onClose={() => setViewIncident(null)}
        incident={viewIncident}
        onResolve={handleGoToResolution}
      />
    </div>
  );
};

export default IncidentList;