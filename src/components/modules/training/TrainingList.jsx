// src/components/modules/training/TrainingList.jsx
import React from 'react';
import { Table, Tag, Button, Space, Progress, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserAddOutlined } from '@ant-design/icons';
import DataTable from '../../common/Tables/DataTable';

const TrainingList = ({ trainings, loading, onEdit, onDelete, onView, onEnroll }) => {
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Título', dataIndex: 'title', key: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
    { title: 'Tipo', dataIndex: 'type', key: 'type', render: (type) => <Tag color={type === 'internal' ? 'blue' : 'purple'}>{type.toUpperCase()}</Tag> },
    { title: 'Instructor', dataIndex: 'instructor', key: 'instructor' },
    { title: 'Fecha', dataIndex: 'date', key: 'date', sorter: (a, b) => new Date(a.date) - new Date(b.date) },
    { title: 'Duración', dataIndex: 'duration', key: 'duration', render: (val) => `${val}h` },
    { title: 'Inscritos', dataIndex: 'enrolled', key: 'enrolled', render: (val, record) => <Progress percent={(val / record.capacity) * 100} size="small" format={() => `${val}/${record.capacity}`} /> },
    { title: 'Acciones', key: 'actions', render: (_, record) => (
      <Space>
        <Tooltip title="Inscribirse"><Button icon={<UserAddOutlined />} size="small" onClick={() => onEnroll(record)} /></Tooltip>
        <Tooltip title="Ver detalles"><Button icon={<EyeOutlined />} size="small" onClick={() => onView(record)} /></Tooltip>
        <Tooltip title="Editar"><Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} /></Tooltip>
        <Tooltip title="Eliminar"><Button icon={<DeleteOutlined />} size="small" danger onClick={() => onDelete(record.id)} /></Tooltip>
      </Space>
    ) },
  ];

  return <DataTable title="Capacitaciones Programadas" columns={columns} dataSource={trainings} loading={loading} rowKey="id" />;
};

export default TrainingList;