// src/components/modules/continuous-improvement/PreventiveActions.jsx
import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;

const PreventiveActions = ({ actions = [], onCreate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { color: 'red', text: 'Alta' },
      medium: { color: 'orange', text: 'Media' },
      low: { color: 'green', text: 'Baja' },
    };
    return configs[priority] || configs.medium;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'orange', text: 'Pendiente' },
      inProgress: { color: 'blue', text: 'En Progreso' },
      completed: { color: 'green', text: 'Completada' },
      cancelled: { color: 'red', text: 'Cancelada' },
    };
    return configs[status] || configs.pending;
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Riesgo Potencial', dataIndex: 'potentialRisk', key: 'potentialRisk', ellipsis: true },
    { title: 'Fuente', dataIndex: 'source', key: 'source', width: 120 },
    { title: 'Causa', dataIndex: 'cause', key: 'cause', ellipsis: true },
    { title: 'Acción Preventiva', dataIndex: 'action', key: 'action', ellipsis: true },
    { 
      title: 'Prioridad', 
      dataIndex: 'priority', 
      key: 'priority', 
      width: 100,
      render: (priority) => {
        const config = getPriorityConfig(priority);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    { 
      title: 'Responsable', 
      dataIndex: 'responsible', 
      key: 'responsible', 
      width: 150 
    },
    { 
      title: 'Estado', 
      dataIndex: 'status', 
      key: 'status', 
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
  ];

  const handleSubmit = async (values) => {
    try {
      const preventiveData = {
        ...values,
        deadline: values.deadline?.format('YYYY-MM-DD'),
      };
      await onCreate(preventiveData);
      message.success('Acción preventiva creada');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al crear');
    }
  };

  return (
    <Card
      title="Acciones Preventivas"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Nueva Acción Preventiva
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={actions}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Nueva Acción Preventiva"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={600}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="potentialRisk"
            label="Riesgo Potencial"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} placeholder="Describa el riesgo potencial identificado" />
          </Form.Item>

          <Form.Item
            name="source"
            label="Fuente del Riesgo"
            rules={[{ required: true }]}
          >
            <Select placeholder="Seleccione la fuente">
              <Select.Option value="audit">Auditoría</Select.Option>
              <Select.Option value="incident">Incidente</Select.Option>
              <Select.Option value="customer">Cliente</Select.Option>
              <Select.Option value="process">Análisis de Proceso</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="cause"
            label="Causa del Riesgo"
            rules={[{ required: true }]}
          >
            <Input placeholder="¿Qué causa este riesgo?" />
          </Form.Item>

          <Form.Item
            name="action"
            label="Acción Preventiva"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} placeholder="Describa la acción preventiva a implementar" />
          </Form.Item>

          <Form.Item name="priority" label="Prioridad" initialValue="medium">
            <Select>
              <Select.Option value="high">Alta</Select.Option>
              <Select.Option value="medium">Media</Select.Option>
              <Select.Option value="low">Baja</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="responsible" label="Responsable">
            <Select placeholder="Seleccione el responsable">
              <Select.Option value="Juan Pérez">Juan Pérez</Select.Option>
              <Select.Option value="María López">María López</Select.Option>
              <Select.Option value="Carlos Ruiz">Carlos Ruiz</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="deadline" label="Fecha Límite">
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Crear Acción Preventiva
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
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

export default PreventiveActions;