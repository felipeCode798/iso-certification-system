// src/components/modules/continuous-improvement/ActionPlan.jsx
import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Progress, Modal, Form, Input, Select, DatePicker } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const ActionPlan = ({ actions, onAdd, onUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Acción',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Responsable',
      dataIndex: 'responsible',
      key: 'responsible',
    },
    {
      title: 'Fecha Límite',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : status === 'inProgress' ? 'blue' : 'orange'}>
          {status === 'completed' ? 'Completada' : status === 'inProgress' ? 'En Progreso' : 'Pendiente'}
        </Tag>
      ),
    },
    {
      title: 'Progreso',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => <Progress percent={progress} size="small" />,
    },
  ];

  const handleSubmit = async (values) => {
    const newAction = {
      ...values,
      id: Date.now(),
      progress: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await onAdd(newAction);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Card
      title="Plan de Acción"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Nueva Acción
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={actions}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-4 bg-gray-50">
              <p><strong>Recursos Necesarios:</strong> {record.resources}</p>
              <p><strong>Evidencia:</strong> {record.evidence}</p>
              <p><strong>Comentarios:</strong> {record.comments}</p>
            </div>
          ),
        }}
      />

      <Modal
        title="Nueva Acción"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="description"
            label="Descripción de la Acción"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="responsible"
            label="Responsable"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="user1">Usuario 1</Select.Option>
              <Select.Option value="user2">Usuario 2</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Fecha Límite"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="resources"
            label="Recursos Necesarios"
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Crear Acción
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ActionPlan;