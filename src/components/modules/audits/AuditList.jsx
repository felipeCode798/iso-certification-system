// src/components/modules/audits/AuditList.jsx
import React, { useState } from 'react';
import { Table, Tag, Button, Space, Badge, Progress, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import DataTable from '../../common/Tables/DataTable';

const AuditList = ({ audits, loading, onView, onEdit, onDelete }) => {
  const getStatusConfig = (status) => {
    const configs = {
      planned: { color: 'processing', text: 'Planificada', icon: <ClockCircleOutlined /> },
      inProgress: { color: 'warning', text: 'En Progreso', icon: <ClockCircleOutlined /> },
      completed: { color: 'success', text: 'Completada', icon: <CheckCircleOutlined /> },
      cancelled: { color: 'error', text: 'Cancelada', icon: null },
    };
    return configs[status] || configs.planned;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const colors = { internal: 'blue', external: 'purple', certification: 'green', followUp: 'orange' };
        return <Tag color={colors[type]}>{type.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Interna', value: 'internal' },
        { text: 'Externa', value: 'external' },
        { text: 'Certificación', value: 'certification' },
      ],
    },
    {
      title: 'Norma',
      dataIndex: 'standard',
      key: 'standard',
      render: (standard) => {
        const labels = { iso9001: 'ISO 9001', iso27001: 'ISO 27001', iso20000: 'ISO 20000' };
        return <Tag>{labels[standard]}</Tag>;
      },
    },
    {
      title: 'Auditor',
      dataIndex: 'auditor',
      key: 'auditor',
    },
    {
      title: 'Fecha',
      dataIndex: 'auditDate',
      key: 'auditDate',
      sorter: (a, b) => new Date(a.auditDate) - new Date(b.auditDate),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Badge status={config.color} text={config.text} />
        );
      },
    },
    {
      title: 'Progreso',
      key: 'progress',
      render: (_, record) => (
        <Progress percent={record.progress || 0} size="small" />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver detalles">
            <Button icon={<EyeOutlined />} size="small" onClick={() => onView(record)} />
          </Tooltip>
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button icon={<DeleteOutlined />} size="small" danger onClick={() => onDelete(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <DataTable
      title="Auditorías"
      columns={columns}
      dataSource={audits}
      loading={loading}
      rowKey="id"
    />
  );
};

export default AuditList;