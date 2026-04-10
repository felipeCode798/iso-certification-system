// src/components/modules/continuous-improvement/ActionPlan.jsx
import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Progress, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;

const ActionPlan = ({ actions = [], onAdd, onUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [form] = Form.useForm();

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'orange', text: 'Pendiente', icon: <ClockCircleOutlined /> },
      inProgress: { color: 'blue', text: 'En Progreso', icon: <ClockCircleOutlined /> },
      completed: { color: 'green', text: 'Completada', icon: <CheckCircleOutlined /> },
      cancelled: { color: 'red', text: 'Cancelada' },
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { color: 'red', text: 'Alta' },
      medium: { color: 'orange', text: 'Media' },
      low: { color: 'green', text: 'Baja' },
    };
    return configs[priority] || configs.medium;
  };

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
      width: 150,
    },
    {
      title: 'Prioridad',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => {
        const config = getPriorityConfig(priority);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Fecha Límite',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 120,
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '—',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Progreso',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress) => <Progress percent={progress || 0} size="small" />,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => {
              setEditingAction(record);
              form.setFieldsValue({
                ...record,
                deadline: record.deadline ? dayjs(record.deadline) : null,
              });
              setIsModalVisible(true);
            }}
          />
        </Space>
      ),
    },
  ];

  const handleSubmit = async (values) => {
    try {
      const actionData = {
        ...values,
        deadline: values.deadline?.format('YYYY-MM-DD'),
        progress: editingAction?.progress || 0,
        status: editingAction?.status || 'pending',
      };
      
      if (editingAction) {
        await onUpdate(editingAction.id, actionData);
        message.success('Acción actualizada');
      } else {
        await onAdd(actionData);
        message.success('Acción creada');
      }
      setIsModalVisible(false);
      setEditingAction(null);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al guardar');
    }
  };

  return (
    <Card
      title="Plan de Acción"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingAction(null);
          form.resetFields();
          setIsModalVisible(true);
        }}>
          Nueva Acción
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={actions}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-4 bg-gray-50">
              <p><strong>Recursos Necesarios:</strong> {record.resources || '—'}</p>
              <p><strong>Evidencia:</strong> {record.evidence || '—'}</p>
              <p><strong>Comentarios:</strong> {record.comments || '—'}</p>
            </div>
          ),
        }}
      />

      <Modal
        title={editingAction ? 'Editar Acción' : 'Nueva Acción'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingAction(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="description"
            label="Descripción de la Acción"
            rules={[{ required: true, message: 'Ingrese la descripción' }]}
          >
            <TextArea rows={3} placeholder="Describa la acción a implementar" />
          </Form.Item>

          <Form.Item
            name="responsible"
            label="Responsable"
            rules={[{ required: true, message: 'Seleccione el responsable' }]}
          >
            <Select placeholder="Seleccione el responsable">
              <Select.Option value="Juan Pérez">Juan Pérez</Select.Option>
              <Select.Option value="María López">María López</Select.Option>
              <Select.Option value="Carlos Ruiz">Carlos Ruiz</Select.Option>
              <Select.Option value="Ana Martínez">Ana Martínez</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Prioridad"
            initialValue="medium"
          >
            <Select>
              <Select.Option value="high">Alta</Select.Option>
              <Select.Option value="medium">Media</Select.Option>
              <Select.Option value="low">Baja</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Fecha Límite"
            rules={[{ required: true, message: 'Seleccione la fecha límite' }]}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="resources" label="Recursos Necesarios">
            <Input placeholder="Recursos requeridos para la acción" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingAction ? 'Actualizar Acción' : 'Crear Acción'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingAction(null);
                form.resetFields();
              }}>
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