// src/components/modules/audits/AuditPlan.jsx
import React, { useState } from 'react';
import { Card, Timeline, Button, Space, Tag, Calendar, Badge, Descriptions, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const AuditPlan = ({ audit, onUpdate }) => {
  const [activities, setActivities] = useState(audit?.activities || []);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getActivityColor = (type) => {
    const colors = {
      opening: 'green',
      audit: 'blue',
      interview: 'orange',
      review: 'purple',
      closing: 'red',
    };
    return colors[type] || 'gray';
  };

  const handleAddActivity = (activity) => {
    setActivities([...activities, { ...activity, id: Date.now() }]);
    setIsModalVisible(false);
  };

  const handleExport = () => {
    // Implementar exportación a PDF
    console.log('Exportando plan...');
  };

  return (
    <Card
      title={`Plan de Auditoría - ${audit?.name}`}
      extra={
        <Space>
          <Button icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Agregar Actividad
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Exportar
          </Button>
        </Space>
      }
    >
      <Descriptions bordered column={2} className="mb-6">
        <Descriptions.Item label="Auditoría">{audit?.name}</Descriptions.Item>
        <Descriptions.Item label="Fecha Inicio">{audit?.startDate}</Descriptions.Item>
        <Descriptions.Item label="Fecha Fin">{audit?.endDate}</Descriptions.Item>
        <Descriptions.Item label="Auditor Líder">{audit?.auditor}</Descriptions.Item>
        <Descriptions.Item label="Alcance" span={2}>{audit?.scope}</Descriptions.Item>
      </Descriptions>

      <Timeline mode="left" className="mt-6">
        {activities.map((activity, index) => (
          <Timeline.Item
            key={activity.id}
            label={activity.time}
            color={getActivityColor(activity.type)}
          >
            <Card size="small" className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{activity.title}</h4>
                  <p className="text-gray-600 text-sm">{activity.description}</p>
                  <Space className="mt-2">
                    <Tag color="blue">{activity.location}</Tag>
                    <Tag color="purple">{activity.responsible}</Tag>
                    <Tag color={getActivityColor(activity.type)}>{activity.type}</Tag>
                  </Space>
                </div>
                <Space>
                  <Button icon={<EditOutlined />} size="small" />
                  <Button icon={<DeleteOutlined />} size="small" danger />
                </Space>
              </div>
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>

      <Modal
        title="Agregar Actividad"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {/* Formulario para agregar actividad */}
      </Modal>
    </Card>
  );
};

export default AuditPlan;