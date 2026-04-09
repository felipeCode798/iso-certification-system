// src/components/modules/nonconformities/NCList.jsx
import React, { useState } from 'react';
import { Table, Tag, Button, Space, Badge, Tooltip, Progress, Modal, message } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, AuditOutlined } from '@ant-design/icons';

const NCList = ({ ncs = [], loading = false, onEdit, onDelete, onView }) => {
  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { color: 'red', text: 'Crítica' },
      major: { color: 'orange', text: 'Mayor' },
      minor: { color: 'yellow', text: 'Menor' },
    };
    return configs[severity] || configs.minor;
  };

  const getStatusConfig = (status) => {
    const configs = {
      open: { color: 'error', text: 'Abierta', icon: <CloseCircleOutlined /> },
      inAnalysis: { color: 'warning', text: 'En Análisis', icon: <AuditOutlined /> },
      action: { color: 'processing', text: 'Acción en Curso', icon: <CheckCircleOutlined /> },
      closed: { color: 'success', text: 'Cerrada', icon: <CheckCircleOutlined /> },
    };
    return configs[status] || configs.open;
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Descripción', dataIndex: 'description', key: 'description', ellipsis: true },
    { 
      title: 'Severidad', 
      dataIndex: 'severity', 
      key: 'severity', 
      width: 100,
      render: (severity) => {
        const config = getSeverityConfig(severity);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: 'Crítica', value: 'critical' },
        { text: 'Mayor', value: 'major' },
        { text: 'Menor', value: 'minor' },
      ],
      onFilter: (value, record) => record.severity === value,
    },
    { 
      title: 'Origen', 
      dataIndex: 'source', 
      key: 'source', 
      width: 120,
      render: (source) => <Tag>{source}</Tag>,
      filters: [
        { text: 'Auditoría', value: 'audit' },
        { text: 'Interna', value: 'internal' },
        { text: 'Cliente', value: 'client' },
        { text: 'Proceso', value: 'process' },
      ],
      onFilter: (value, record) => record.source === value,
    },
    { 
      title: 'Estado', 
      dataIndex: 'status', 
      key: 'status', 
      width: 130,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Badge status={config.color} text={config.text} />;
      },
    },
    { 
      title: 'Progreso', 
      key: 'progress', 
      width: 120,
      render: (_, record) => <Progress percent={record.progress || 0} size="small" /> 
    },
    { 
      title: 'Fecha', 
      dataIndex: 'detectionDate', 
      key: 'detectionDate', 
      width: 120,
      sorter: (a, b) => new Date(a.detectionDate) - new Date(b.detectionDate),
    },
    { 
      title: 'Acciones', 
      key: 'actions', 
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver detalles">
            <Button icon={<EyeOutlined />} size="small" onClick={() => onView(record)} />
          </Tooltip>
          <Tooltip title="Análisis Causa Raíz">
            <Button icon={<AuditOutlined />} size="small" onClick={() => onView(record)} />
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
    <div className="nc-list">
      <Table 
        columns={columns} 
        dataSource={ncs} 
        loading={loading} 
        rowKey="id" 
        pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} no conformidades` }}
      />
    </div>
  );
};

export default NCList;