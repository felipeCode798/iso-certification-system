import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import FormModal from '../../common/Modals/FormModal';

const ProcessForm = ({ visible, onClose, onSubmit, process = null }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && process) {
      form.setFieldsValue(process);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, process, form]);

  const handleSubmit = async (values) => {
    await onSubmit({ ...values, id: process?.id });
    form.resetFields();
  };

  return (
    <FormModal
      visible={visible}
      onCancel={onClose}
      onSubmit={handleSubmit}
      title={process ? 'Editar Proceso' : 'Nuevo Proceso'}
      width={650}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item name="code" label="Código" rules={[{ required: true, message: 'Requerido' }]}>
            <Input placeholder="Ej: PR-001" />
          </Form.Item>
          <Form.Item name="type" label="Tipo" rules={[{ required: true, message: 'Requerido' }]}>
            <Select placeholder="Seleccionar tipo">
              <Select.Option value="strategic">Estratégico</Select.Option>
              <Select.Option value="core">Operativo/Core</Select.Option>
              <Select.Option value="support">Soporte</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="name" label="Nombre del Proceso" rules={[{ required: true, message: 'Requerido' }]}>
          <Input placeholder="Nombre del proceso" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item name="owner" label="Dueño del Proceso" rules={[{ required: true, message: 'Requerido' }]}>
            <Input placeholder="Responsable" />
          </Form.Item>
          <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
            <Select placeholder="Estado">
              <Select.Option value="active">Activo</Select.Option>
              <Select.Option value="review">En Revisión</Select.Option>
              <Select.Option value="inactive">Inactivo</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="description" label="Descripción">
          <Input.TextArea rows={2} placeholder="Descripción del proceso" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item name="inputs" label="Entradas">
            <Input.TextArea rows={2} placeholder="Entradas del proceso" />
          </Form.Item>
          <Form.Item name="outputs" label="Salidas">
            <Input.TextArea rows={2} placeholder="Salidas del proceso" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item name="resources" label="Recursos">
            <Input placeholder="Recursos necesarios" />
          </Form.Item>
          <Form.Item name="indicators" label="Indicadores Clave">
            <Input placeholder="KPIs del proceso" />
          </Form.Item>
        </div>
      </Form>
    </FormModal>
  );
};

export default ProcessForm;