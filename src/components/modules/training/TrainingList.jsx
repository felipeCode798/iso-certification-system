// src/components/modules/training/TrainingList.jsx
import React from 'react';
import { Table, Tag, Button, Space, Progress, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserAddOutlined } from '@ant-design/icons';

const TrainingList = ({ trainings = [], loading = false, onEdit, onDelete, onView, onEnroll }) => {
  const getTypeColor = (type) => {
    const colors = { internal: 'blue', external: 'purple', workshop: 'green' };
    return colors[type] || 'default';
  };

  const getTypeLabel = (type) => {
    const labels = { internal: 'Interna', external: 'Externa', workshop: 'Taller' };
    return labels[type] || type;
  };

  const getStandardLabel = (standard) => {
    const labels = { iso9001: 'ISO 9001', iso27001: 'ISO 27001', iso20000: 'ISO 20000' };
    return labels[standard] || standard;
  };

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id', 
      width: 80 
    },
    { 
      title: 'Título', 
      dataIndex: 'title', 
      key: 'title', 
      sorter: (a, b) => a.title.localeCompare(b.title) 
    },
    { 
      title: 'Tipo', 
      dataIndex: 'type', 
      key: 'type', 
      width: 100,
      render: (type) => <Tag color={getTypeColor(type)}>{getTypeLabel(type)}</Tag> 
    },
    { 
      title: 'Norma', 
      dataIndex: 'standard', 
      key: 'standard', 
      width: 100,
      render: (standard) => standard ? <Tag color="geekblue">{getStandardLabel(standard)}</Tag> : '—' 
    },
    { 
      title: 'Instructor', 
      dataIndex: 'instructor', 
      key: 'instructor', 
      width: 150 
    },
    { 
      title: 'Fecha', 
      dataIndex: 'date', 
      key: 'date', 
      width: 120,
      sorter: (a, b) => new Date(a.date) - new Date(b.date) 
    },
    { 
      title: 'Duración', 
      dataIndex: 'duration', 
      key: 'duration', 
      width: 90,
      render: (val) => `${val}h` 
    },
    { 
      title: 'Inscritos', 
      dataIndex: 'enrolled', 
      key: 'enrolled', 
      width: 120,
      render: (val, record) => (
        <Progress 
          percent={((val || 0) / (record.capacity || 1)) * 100} 
          size="small" 
          format={() => `${val || 0}/${record.capacity || 0}`} 
        />
      ) 
    },
    { 
      title: 'Acciones', 
      key: 'actions', 
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Inscribirse">
            <Button 
              icon={<UserAddOutlined />} 
              size="small" 
              onClick={() => onEnroll(record)}
              disabled={record.enrolled >= record.capacity}
            />
          </Tooltip>
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
      ) 
    },
  ];

  return (
    <div className="training-list">
      <Table 
        columns={columns} 
        dataSource={trainings} 
        loading={loading} 
        rowKey="id" 
        pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} capacitaciones` }}
        scroll={{ x: 1100 }}
      />
    </div>
  );
};

export default TrainingList;