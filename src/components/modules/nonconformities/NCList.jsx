// src/components/modules/nonconformities/NCList.jsx
import React, { useState } from 'react';
import { Table, Tag, Button, Space, Badge, Tooltip, Progress, Modal, message } from 'antd';
import { 
  EyeOutlined, EditOutlined, DeleteOutlined, 
  CheckCircleOutlined, CloseCircleOutlined, 
  AuditOutlined, ToolOutlined 
} from '@ant-design/icons';

const NCList = ({ ncs = [], loading = false, onEdit, onDelete, onView, onAnalyze }) => {
  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { color: 'red', text: 'Crítica' },
      major: { color: 'orange', text: 'Mayor' },
      minor: { color: 'gold', text: 'Menor' },
    };
    return configs[severity] || configs.minor;
  };

  const getStatusConfig = (status) => {
    const configs = {
      open: { color: 'error', text: 'Abierta', icon: <CloseCircleOutlined /> },
      inAnalysis: { color: 'warning', text: 'En Análisis', icon: <AuditOutlined /> },
      action: { color: 'processing', text: 'Acción en Curso', icon: <ToolOutlined /> },
      closed: { color: 'success', text: 'Cerrada', icon: <CheckCircleOutlined /> },
    };
    return configs[status] || configs.open;
  };

  const getStandardLabel = (standard) => {
    const labels = { iso9001: 'ISO 9001', iso27001: 'ISO 27001', iso20000: 'ISO 20000' };
    return labels[standard] || standard;
  };

  const getSourceLabel = (source) => {
    const labels = { audit: 'Auditoría', internal: 'Interna', client: 'Cliente', process: 'Proceso' };
    return labels[source] || source;
  };

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id', 
      width: 80 
    },
    { 
      title: 'Descripción', 
      dataIndex: 'description', 
      key: 'description', 
      ellipsis: true 
    },
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
      width: 110,
      render: (source) => <Tag>{getSourceLabel(source)}</Tag>,
      filters: [
        { text: 'Auditoría', value: 'audit' },
        { text: 'Interna', value: 'internal' },
        { text: 'Cliente', value: 'client' },
        { text: 'Proceso', value: 'process' },
      ],
      onFilter: (value, record) => record.source === value,
    },
    { 
      title: 'Norma', 
      dataIndex: 'standard', 
      key: 'standard', 
      width: 100,
      render: (standard) => standard ? <Tag color="geekblue">{getStandardLabel(standard)}</Tag> : '—',
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
      filters: [
        { text: 'Abierta', value: 'open' },
        { text: 'En Análisis', value: 'inAnalysis' },
        { text: 'Acción en Curso', value: 'action' },
        { text: 'Cerrada', value: 'closed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    { 
      title: 'Progreso', 
      key: 'progress', 
      width: 120,
      render: (_, record) => (
        <Progress 
          percent={record.progress || 0} 
          size="small" 
          strokeColor={record.progress === 100 ? '#52c41a' : '#1890ff'}
        />
      ) 
    },
    { 
      title: 'Responsable', 
      dataIndex: 'responsible', 
      key: 'responsible', 
      width: 120,
      render: (responsible) => responsible || '—'
    },
    { 
      title: 'Fecha Detección', 
      dataIndex: 'detectionDate', 
      key: 'detectionDate', 
      width: 120,
      sorter: (a, b) => new Date(a.detectionDate) - new Date(b.detectionDate),
    },
    { 
      title: 'Acciones', 
      key: 'actions', 
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver detalles">
            <Button icon={<EyeOutlined />} size="small" onClick={() => onView(record)} />
          </Tooltip>
          {record.status !== 'closed' && (
            <Tooltip title="Análisis Causa Raíz">
              <Button 
                icon={<AuditOutlined />} 
                size="small" 
                onClick={() => onAnalyze(record)}
              />
            </Tooltip>
          )}
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
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default NCList;