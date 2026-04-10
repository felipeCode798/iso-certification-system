// src/components/modules/audits/AuditList.jsx
import React, { useState } from 'react';
import { Table, Tag, Button, Space, Badge, Progress, Tooltip, Modal, message } from 'antd';
import { 
  EyeOutlined, EditOutlined, DeleteOutlined, 
  CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined 
} from '@ant-design/icons';

const AuditList = ({ audits, loading, onView, onEdit, onDelete, onViewReport }) => {
  const getStatusConfig = (status) => {
    const configs = {
      planned: { color: 'processing', text: 'Planificada', icon: <ClockCircleOutlined /> },
      inProgress: { color: 'warning', text: 'En Progreso', icon: <ClockCircleOutlined /> },
      completed: { color: 'success', text: 'Completada', icon: <CheckCircleOutlined /> },
      cancelled: { color: 'error', text: 'Cancelada', icon: null },
    };
    return configs[status] || configs.planned;
  };

  const getStandardLabel = (standard) => {
    const labels = { iso9001: 'ISO 9001', iso27001: 'ISO 27001', iso20000: 'ISO 20000' };
    return labels[standard] || standard;
  };

  const handleDeleteConfirm = (audit) => {
    Modal.confirm({
      title: '¿Eliminar auditoría?',
      content: `Se eliminará "${audit.name}". Esta acción no se puede deshacer.`,
      okText: 'Eliminar',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: () => onDelete(audit.id),
    });
  };

  const columns = [
    {
      title: 'Código',
      dataIndex: 'auditCode',
      key: 'auditCode',
      width: 120,
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
      width: 120,
      render: (type) => {
        const colors = { internal: 'blue', external: 'purple', certification: 'green', followUp: 'orange' };
        const labels = { internal: 'Interna', external: 'Externa', certification: 'Certificación', followUp: 'Seguimiento' };
        return <Tag color={colors[type]}>{labels[type]}</Tag>;
      },
    },
    {
      title: 'Norma',
      dataIndex: 'standard',
      key: 'standard',
      width: 120,
      render: (standard) => <Tag color="geekblue">{getStandardLabel(standard)}</Tag>,
    },
    {
      title: 'Auditor Líder',
      dataIndex: 'auditor',
      key: 'auditor',
      width: 150,
    },
    {
      title: 'Fecha',
      dataIndex: 'auditDate',
      key: 'auditDate',
      width: 120,
      sorter: (a, b) => new Date(a.auditDate) - new Date(b.auditDate),
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
      render: (_, record) => (
        <Progress percent={record.progress || 0} size="small" />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver plan de auditoría">
            <Button icon={<EyeOutlined />} size="small" onClick={() => onView(record)} />
          </Tooltip>
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} />
          </Tooltip>
          {record.status === 'completed' && (
            <Tooltip title="Ver informe">
              <Button icon={<FileTextOutlined />} size="small" onClick={() => onViewReport(record)} />
            </Tooltip>
          )}
          <Tooltip title="Eliminar">
            <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDeleteConfirm(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={audits}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10, showTotal: (total) => `Total: ${total} auditorías` }}
      scroll={{ x: 1200 }}
    />
  );
};

export default AuditList;