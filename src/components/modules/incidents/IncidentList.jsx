import React, { useState } from 'react';
import { Table, Tag, Button, Space, Badge, Tooltip, Progress, Input, Modal, Row, Col, Statistic } from 'antd';
import {
  EyeOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, PlusOutlined, FireOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import IncidentDetail from './IncidentDetail';

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
  const [search, setSearch]       = useState('');
  const [viewIncident, setViewIncident] = useState(null);

  const filtered = incidents.filter(i =>
    i.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.reportedBy?.toLowerCase().includes(search.toLowerCase()) ||
    i.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (record) => {
    Modal.confirm({
      title: '¿Eliminar incidente?',
      content: `Se eliminará "${record.title}".`,
      okText: 'Eliminar', okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: () => onDelete(record.id),
    });
  };

  // Estadísticas rápidas
  const stats = {
    open:       incidents.filter(i => i.status === 'open').length,
    inProgress: incidents.filter(i => i.status === 'inProgress').length,
    resolved:   incidents.filter(i => i.status === 'resolved').length,
    critical:   incidents.filter(i => i.severity === 'critical').length,
  };

  const columns = [
    {
      title: 'Incidente', dataIndex: 'title', key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title, r) => (
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-gray-400">{r.reportedBy} · {r.reportedDate}</div>
        </div>
      ),
    },
    {
      title: 'Severidad', dataIndex: 'severity', key: 'severity', width: 100,
      render: s => { const c = severityConfig[s]; return <Tag color={c?.color}>{c?.label}</Tag>; },
      filters: Object.entries(severityConfig).map(([v, c]) => ({ text: c.label, value: v })),
      onFilter: (v, r) => r.severity === v,
      sorter: (a, b) => {
        const order = { critical: 4, high: 3, medium: 2, low: 1 };
        return (order[b.severity] || 0) - (order[a.severity] || 0);
      },
    },
    {
      title: 'Estado', dataIndex: 'status', key: 'status', width: 130,
      render: s => { const c = statusConfig[s]; return <Badge status={c?.badge} text={c?.label} />; },
      filters: Object.entries(statusConfig).map(([v, c]) => ({ text: c.label, value: v })),
      onFilter: (v, r) => r.status === v,
    },
    {
      title: 'Categoría', dataIndex: 'category', key: 'category', width: 110,
      render: cat => <Tag color={categoryColors[cat]}>{cat}</Tag>,
    },
    {
      title: 'Progreso', dataIndex: 'progress', key: 'progress', width: 140,
      render: (val, r) => (
        <Tooltip title={`${val}% completado`}>
          <Progress
            percent={val} size="small"
            status={r.status === 'resolved' ? 'success' : 'active'}
            strokeColor={val >= 75 ? '#52c41a' : val >= 40 ? '#faad14' : '#ff4d4f'}
          />
        </Tooltip>
      ),
      sorter: (a, b) => b.progress - a.progress,
    },
    {
      title: 'SLA', key: 'sla', width: 80,
      render: (_, r) => {
        if (!r.slaTime) return '—';
        const pct = Math.round((r.resolutionTime / r.slaTime) * 100);
        const ok  = pct <= 100;
        return (
          <Tooltip title={`${r.resolutionTime || 0}h de ${r.slaTime}h`}>
            <Tag color={ok ? 'success' : 'error'}>{ok ? '✓ OK' : '⚠ Vencido'}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Norma', dataIndex: 'standard', key: 'standard', width: 90,
      render: s => s ? <Tag color="geekblue">{s.toUpperCase()}</Tag> : '—',
    },
    {
      title: 'Acciones', key: 'actions', width: 110,
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

  return (
    <div>
      {/* Métricas rápidas */}
      <Row gutter={[12, 12]} className="mb-4">
        {[
          { label: 'Abiertos',    value: stats.open,       color: '#ff4d4f', icon: <ClockCircleOutlined /> },
          { label: 'En Progreso', value: stats.inProgress, color: '#faad14', icon: <ClockCircleOutlined /> },
          { label: 'Resueltos',   value: stats.resolved,   color: '#52c41a', icon: <CheckCircleOutlined /> },
          { label: 'Críticos',    value: stats.critical,   color: '#ff4d4f', icon: <FireOutlined />        },
        ].map(s => (
          <Col span={6} key={s.label}>
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
          prefix={<SearchOutlined />} className="w-80" allowClear
          onChange={e => setSearch(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onNew}>
          Reportar Incidente
        </Button>
      </div>

      <Table
        columns={columns} dataSource={filtered} rowKey="id"
        loading={loading} size="middle"
        pagination={{ pageSize: 8, showTotal: t => `Total: ${t} incidentes` }}
        rowClassName={r => r.severity === 'critical' && r.status !== 'closed' ? 'bg-red-50' : ''}
      />

      <IncidentDetail
        visible={!!viewIncident}
        onClose={() => setViewIncident(null)}
        incident={viewIncident}
        onResolve={(inc) => { setViewIncident(null); onResolve?.(inc); }}
      />
    </div>
  );
};

export default IncidentList;