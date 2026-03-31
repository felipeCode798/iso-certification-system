// src/components/modules/nonconformities/NCList.jsx
import React, { useState } from 'react';
import { Table, Tag, Button, Space, Badge, Tooltip, Progress, Modal } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import DataTable from '../../common/Tables/DataTable';
import NCAnalysis from './NCAnalysis';

const NCList = ({ ncs, loading, onEdit, onDelete }) => {
  const [selectedNC, setSelectedNC] = useState(null);
  const [analysisVisible, setAnalysisVisible] = useState(false);

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
      open: { color: 'error', text: 'Abierta' },
      inAnalysis: { color: 'warning', text: 'En Análisis' },
      action: { color: 'processing', text: 'Acción en Curso' },
      closed: { color: 'success', text: 'Cerrada' },
    };
    return configs[status] || configs.open;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Severidad',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => {
        const config = getSeverityConfig(severity);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Origen',
      dataIndex: 'source',
      key: 'source',
      render: (source) => <Tag>{source}</Tag>,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = getStatusConfig(status);
        return <Badge status={config.color} text={config.text} />;
      },
    },
    {
      title: 'Progreso',
      key: 'progress',
      render: (_, record) => <Progress percent={record.progress || 0} size="small" />,
    },
    {
      title: 'Fecha',
      dataIndex: 'detectionDate',
      key: 'detectionDate',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver detalles">
            <Button icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Análisis Causa Raíz">
            <Button icon={<CheckCircleOutlined />} size="small" onClick={() => {
              setSelectedNC(record);
              setAnalysisVisible(true);
            }} />
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
    <>
      <DataTable
        title="No Conformidades"
        columns={columns}
        dataSource={ncs}
        loading={loading}
        rowKey="id"
      />
      
      <NCAnalysis
        visible={analysisVisible}
        onClose={() => setAnalysisVisible(false)}
        nc={selectedNC}
      />
    </>
  );
};

export default NCList;