// src/components/modules/processes/ProcessForm.jsx
import React, { useEffect } from 'react';
import { Input, Select, message } from 'antd';
import FormModal from '../../common/Modals/FormModal';

const ProcessForm = ({ visible, onClose, onSubmit, process = null, loading = false }) => {
  const [form] = FormModal.useForm();

  useEffect(() => {
    if (visible && process) {
      form.setFieldsValue({
        code: process.code,
        name: process.name,
        type: process.type,
        owner: process.owner,
        status: process.status,
        description: process.description,
        inputs: process.inputs,
        outputs: process.outputs,
        resources: process.resources,
        indicators: process.indicators,
        effectiveness: process.effectiveness,
        efficiency: process.efficiency,
        quality: process.quality,
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({
        status: 'active',
        effectiveness: 0,
        efficiency: 0,
        quality: 0,
      });
    }
  }, [visible, process, form]);

  const handleSubmit = async (values) => {
    try {
      console.log('📝 Valores del formulario:', values);
      
      const payload = {
        code: values.code,
        name: values.name,
        type: values.type,
        owner: values.owner,
        status: values.status || 'active',
        description: values.description || '',
        inputs: values.inputs || '',
        outputs: values.outputs || '',
        resources: values.resources || '',
        indicators: values.indicators || '',
        effectiveness: values.effectiveness || 0,
        efficiency: values.efficiency || 0,
        quality: values.quality || 0,
      };
      
      console.log('📤 Enviando proceso:', payload);
      await onSubmit(payload);
      form.resetFields();
    } catch (error) {
      console.error('❌ Error:', error);
      const errorMsg = error.response?.data?.message;
      if (Array.isArray(errorMsg)) {
        message.error(errorMsg.join(', '));
      } else if (typeof errorMsg === 'string') {
        message.error(errorMsg);
      } else {
        message.error('Error al guardar el proceso');
      }
      throw error;
    }
  };

  return (
    <FormModal
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onSubmit={handleSubmit}
      title={process ? 'Editar Proceso' : 'Nuevo Proceso'}
      width={650}
      loading={loading}
      form={form}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FormModal.Item
          name="code"
          label="Código"
          rules={[{ required: true, message: 'Ingrese el código' }]}
        >
          <Input placeholder="Ej: PR-001" />
        </FormModal.Item>
        <FormModal.Item
          name="type"
          label="Tipo"
          rules={[{ required: true, message: 'Seleccione el tipo' }]}
        >
          <Select placeholder="Seleccionar tipo">
            <Select.Option value="strategic">Estratégico</Select.Option>
            <Select.Option value="core">Operativo/Core</Select.Option>
            <Select.Option value="support">Soporte</Select.Option>
          </Select>
        </FormModal.Item>
      </div>

      <FormModal.Item
        name="name"
        label="Nombre del Proceso"
        rules={[{ required: true, message: 'Ingrese el nombre' }]}
      >
        <Input placeholder="Nombre del proceso" />
      </FormModal.Item>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FormModal.Item
          name="owner"
          label="Dueño del Proceso"
          rules={[{ required: true, message: 'Ingrese el responsable' }]}
        >
          <Input placeholder="Responsable" />
        </FormModal.Item>
        <FormModal.Item
          name="status"
          label="Estado"
          rules={[{ required: true }]}
        >
          <Select placeholder="Estado">
            <Select.Option value="active">Activo</Select.Option>
            <Select.Option value="review">En Revisión</Select.Option>
            <Select.Option value="inactive">Inactivo</Select.Option>
          </Select>
        </FormModal.Item>
      </div>

      <FormModal.Item name="description" label="Descripción">
        <Input.TextArea rows={2} placeholder="Descripción del proceso" />
      </FormModal.Item>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FormModal.Item name="inputs" label="Entradas">
          <Input.TextArea rows={2} placeholder="Entradas del proceso" />
        </FormModal.Item>
        <FormModal.Item name="outputs" label="Salidas">
          <Input.TextArea rows={2} placeholder="Salidas del proceso" />
        </FormModal.Item>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FormModal.Item name="resources" label="Recursos">
          <Input placeholder="Recursos necesarios" />
        </FormModal.Item>
        <FormModal.Item name="indicators" label="Indicadores Clave">
          <Input placeholder="KPIs del proceso" />
        </FormModal.Item>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <FormModal.Item name="effectiveness" label="Eficacia (%)">
          <Input type="number" min={0} max={100} placeholder="0-100" />
        </FormModal.Item>
        <FormModal.Item name="efficiency" label="Eficiencia (%)">
          <Input type="number" min={0} max={100} placeholder="0-100" />
        </FormModal.Item>
        <FormModal.Item name="quality" label="Calidad (%)">
          <Input type="number" min={0} max={100} placeholder="0-100" />
        </FormModal.Item>
      </div>
    </FormModal>
  );
};

export default ProcessForm;