import React, { useState } from 'react';
import { Table, Tag, Button, Space, Progress, Tooltip, Input, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, LineChartOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';

const typeConfig = {
  strategic: { color: 'purple', label: 'Estratégico' },
  core:      { color: 'blue',   label: 'Operativo'   },
  support:   { color: 'green',  label: 'Soporte'     },
};

const ProcessList = ({ processes = [], loading, onEdit, onDelete, onViewMetrics, onNew }) => {
  const [search, setSearch] = useState('');

  const filtered = processes.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.code?.toLowerCase().includes(search.toLowerCase()) ||
    p.owner?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (record) => {
    Modal.confirm({
      title: '¿Eliminar proceso?',
      content: `Se eliminará "${record.name}" permanentemente.`,
      okText: 'Eliminar',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: () => onDelete(record.id),
    });
  };

  const columns = [
    { title: 'Código', dataIndex: 'code', key: 'code', width: 100, sorter: (a, b) => a.code.localeCompare(b.code) },
    {
      title: 'Proceso', dataIndex: 'name', key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-400">{record.owner}</div>
        </div>
      ),
    },
    {
      title: 'Tipo', dataIndex: 'type', key: 'type', width: 120,
      render: (type) => <Tag color={typeConfig[type]?.color}>{typeConfig[type]?.label || type}</Tag>,
      filters: Object.entries(typeConfig).map(([v, c]) => ({ text: c.label, value: v })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Eficacia', dataIndex: 'effectiveness', key: 'effectiveness', width: 160,
      sorter: (a, b) => a.effectiveness - b.effectiveness,
      render: (val) => (
        <div>
          <Progress
            percent={val}
            size="small"
            strokeColor={val >= 90 ? '#52c41a' : val >= 75 ? '#faad14' : '#ff4d4f'}
            format={p => `${p}%`}
          />
        </div>
      ),
    },
    {
      title: 'Estado', dataIndex: 'status', key: 'status', width: 120,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : status === 'review' ? 'warning' : 'default'}>
          {status === 'active' ? 'Activo' : status === 'review' ? 'En Revisión' : 'Inactivo'}
        </Tag>
      ),
    },
    {
      title: 'Acciones', key: 'actions', width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver métricas">
            <Button icon={<LineChartOutlined />} size="small" type="primary" ghost onClick={() => onViewMetrics(record)} />
          </Tooltip>
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} />
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
      <div className="flex justify-between items-center mb-3">
        <Input
          placeholder="Buscar por código, nombre o dueño..."
          prefix={<SearchOutlined />}
          className="w-72"
          allowClear
          onChange={e => setSearch(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onNew}>
          Nuevo Proceso
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filtered}
        loading={loading}
        rowKey="id"
        size="middle"
        pagination={{ pageSize: 8, showTotal: total => `Total: ${total} procesos` }}
      />
    </div>
  );
};

export default ProcessList;