// src/components/modules/indicators/KPIDefinition.jsx
import React, { useState } from 'react';
import { Card, Table, Button, Tag, Modal, Form, Input, Select, InputNumber, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const KPIDefinition = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKPI, setEditingKPI] = useState(null);

  const columns = [
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Indicador',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Norma',
      dataIndex: 'standard',
      key: 'standard',
      render: (standard) => <Tag color="blue">{standard}</Tag>,
    },
    {
      title: 'Fórmula',
      dataIndex: 'formula',
      key: 'formula',
      ellipsis: true,
    },
    {
      title: 'Frecuencia',
      dataIndex: 'frequency',
      key: 'frequency',
    },
    {
      title: 'Meta',
      dataIndex: 'target',
      key: 'target',
      render: (target, record) => `${target} ${record.unit}`,
    },
    {
      title: 'Responsable',
      dataIndex: 'responsible',
      key: 'responsible',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (kpi) => {
    setEditingKPI(kpi);
    form.setFieldsValue(kpi);
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    console.log('KPI definido:', values);
    setIsModalVisible(false);
    form.resetFields();
    setEditingKPI(null);
  };

  return (
    <Card
      title="Definición de Indicadores KPI"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Nuevo KPI
        </Button>
      }
    >
      <Table columns={columns} dataSource={[]} rowKey="id" />

      <Modal
        title={editingKPI ? 'Editar KPI' : 'Definir Nuevo KPI'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingKPI(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="code"
            label="Código del KPI"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ej: KPI-001" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Nombre del Indicador"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ej: Porcentaje de cumplimiento de auditorías" />
          </Form.Item>

          <Form.Item
            name="standard"
            label="Norma Asociada"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="iso9001">ISO 9001:2015</Select.Option>
              <Select.Option value="iso27001">ISO 27001:2022</Select.Option>
              <Select.Option value="iso20000">ISO 20000:2018</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} placeholder="¿Qué mide este indicador?" />
          </Form.Item>

          <Form.Item
            name="formula"
            label="Fórmula de Cálculo"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ej: (Auditorías realizadas / Auditorías planificadas) * 100" />
          </Form.Item>

          <Form.Item
            name="frequency"
            label="Frecuencia de Medición"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="daily">Diaria</Select.Option>
              <Select.Option value="weekly">Semanal</Select.Option>
              <Select.Option value="monthly">Mensual</Select.Option>
              <Select.Option value="quarterly">Trimestral</Select.Option>
              <Select.Option value="annual">Anual</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="target"
            label="Meta"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" placeholder="Valor objetivo" />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Unidad"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="%">Porcentaje (%)</Select.Option>
              <Select.Option value="horas">Horas</Select.Option>
              <Select.Option value="días">Días</Select.Option>
              <Select.Option value="veces">Veces</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="responsible"
            label="Responsable"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nombre del responsable" />
          </Form.Item>

          <Form.Item
            name="dataSource"
            label="Fuente de Datos"
          >
            <Input placeholder="¿De dónde se obtienen los datos?" />
          </Form.Item>

          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={() => setIsModalVisible(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit">Guardar KPI</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default KPIDefinition;