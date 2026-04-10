// src/components/modules/indicators/KPIDefinition.jsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Modal, Form, Input, Select, InputNumber, Space, Tooltip, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { 
  useGetKPIsQuery, 
  useCreateKPIMutation, 
  useUpdateKPIMutation, 
  useDeleteKPIMutation 
} from '../../../services/api/indicatorsService';

const { TextArea } = Input;

const KPIDefinition = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKPI, setEditingKPI] = useState(null);
  
  const { data: kpisData, isLoading, refetch } = useGetKPIsQuery();
  const createMutation = useCreateKPIMutation();
  const updateMutation = useUpdateKPIMutation();
  const deleteMutation = useDeleteKPIMutation();
  
  const kpis = kpisData?.data || kpisData || [];

  const columns = [
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
      width: 120,
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
      width: 120,
      render: (standard) => {
        const labels = { iso9001: 'ISO 9001', iso27001: 'ISO 27001', iso20000: 'ISO 20000', general: 'General' };
        return <Tag color="blue">{labels[standard] || standard}</Tag>;
      },
    },
    {
      title: 'Fórmula',
      dataIndex: 'formula',
      key: 'formula',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Frecuencia',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 100,
      render: (freq) => {
        const labels = { daily: 'Diaria', weekly: 'Semanal', monthly: 'Mensual', quarterly: 'Trimestral', annual: 'Anual' };
        return <Tag>{labels[freq] || freq}</Tag>;
      },
    },
    {
      title: 'Meta',
      dataIndex: 'target',
      key: 'target',
      width: 100,
      render: (target, record) => `${target} ${record.unit}`,
    },
    {
      title: 'Responsable',
      dataIndex: 'responsible',
      key: 'responsible',
      width: 150,
    },
    {
      title: 'Estado',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'Activo' : 'Inactivo'}</Tag>,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Popconfirm
              title="¿Eliminar este KPI?"
              description="Esta acción no se puede deshacer"
              onConfirm={() => handleDelete(record.id)}
              okText="Sí, eliminar"
              cancelText="Cancelar"
            >
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (kpi) => {
    setEditingKPI(kpi);
    form.setFieldsValue({
      code: kpi.code,
      name: kpi.name,
      standard: kpi.standard,
      description: kpi.description,
      formula: kpi.formula,
      frequency: kpi.frequency,
      target: kpi.target,
      unit: kpi.unit,
      responsible: kpi.responsible,
      dataSource: kpi.dataSource,
      yellowThreshold: kpi.yellowThreshold,
      redThreshold: kpi.redThreshold,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('KPI eliminado exitosamente');
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingKPI) {
        await updateMutation.mutateAsync({ id: editingKPI.id, data: values });
        message.success('KPI actualizado exitosamente');
      } else {
        await createMutation.mutateAsync(values);
        message.success('KPI creado exitosamente');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingKPI(null);
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al guardar');
    }
  };

  return (
    <Card
      title="Definición de Indicadores KPI"
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>Actualizar</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setEditingKPI(null);
            form.resetFields();
            setIsModalVisible(true);
          }}>
            Nuevo KPI
          </Button>
        </Space>
      }
    >
      <Table 
        columns={columns} 
        dataSource={kpis} 
        rowKey="id" 
        loading={isLoading}
        pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} KPIs` }}
        scroll={{ x: 1200 }}
      />

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
        destroyOnClose
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
          initialValues={{
            frequency: 'monthly',
            unit: '%',
            yellowThreshold: 90,
            redThreshold: 80,
          }}
        >
          <Form.Item
            name="code"
            label="Código del KPI"
            rules={[{ required: true, message: 'El código es requerido' }]}
          >
            <Input placeholder="Ej: KPI-001" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Nombre del Indicador"
            rules={[{ required: true, message: 'El nombre es requerido' }]}
          >
            <Input placeholder="Ej: Porcentaje de cumplimiento de auditorías" />
          </Form.Item>

          <Form.Item
            name="standard"
            label="Norma Asociada"
            rules={[{ required: true, message: 'La norma es requerida' }]}
          >
            <Select>
              <Select.Option value="iso9001">ISO 9001:2015 - Calidad</Select.Option>
              <Select.Option value="iso27001">ISO 27001:2022 - Seguridad</Select.Option>
              <Select.Option value="iso20000">ISO 20000:2018 - Servicios TI</Select.Option>
              <Select.Option value="general">General</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: 'La descripción es requerida' }]}
          >
            <TextArea rows={2} placeholder="¿Qué mide este indicador?" />
          </Form.Item>

          <Form.Item
            name="formula"
            label="Fórmula de Cálculo"
            rules={[{ required: true, message: 'La fórmula es requerida' }]}
          >
            <Input placeholder="Ej: (Auditorías realizadas / Auditorías planificadas) * 100" />
          </Form.Item>

          <Form.Item
            name="frequency"
            label="Frecuencia de Medición"
            rules={[{ required: true, message: 'La frecuencia es requerida' }]}
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
            rules={[{ required: true, message: 'La meta es requerida' }]}
          >
            <InputNumber className="w-full" placeholder="Valor objetivo" />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Unidad"
            rules={[{ required: true, message: 'La unidad es requerida' }]}
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
            rules={[{ required: true, message: 'El responsable es requerido' }]}
          >
            <Input placeholder="Nombre del responsable" />
          </Form.Item>

          <Form.Item
            name="dataSource"
            label="Fuente de Datos"
          >
            <Input placeholder="¿De dónde se obtienen los datos?" />
          </Form.Item>

          <Form.Item
            name="yellowThreshold"
            label="Umbral Amarillo (%)"
            tooltip="Porcentaje del objetivo que activa el estado amarillo"
          >
            <InputNumber min={0} max={100} className="w-full" placeholder="Ej: 90" />
          </Form.Item>

          <Form.Item
            name="redThreshold"
            label="Umbral Rojo (%)"
            tooltip="Porcentaje del objetivo que activa el estado rojo"
          >
            <InputNumber min={0} max={100} className="w-full" placeholder="Ej: 80" />
          </Form.Item>

          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingKPI(null);
                form.resetFields();
              }}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                {editingKPI ? 'Actualizar KPI' : 'Guardar KPI'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default KPIDefinition;