// src/components/modules/audits/AuditForm.jsx
import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Space, Button } from 'antd';
import { UserOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import FormModal from '../../common/Modals/FormModal';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const AuditForm = ({ visible, onClose, onSubmit, audit = null }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const auditData = {
      ...values,
      auditDate: values.auditDate?.format('YYYY-MM-DD'),
      id: audit?.id,
    };
    await onSubmit(auditData);
    form.resetFields();
  };

  return (
    <FormModal
      visible={visible}
      onCancel={onClose}
      onSubmit={handleSubmit}
      title={audit ? 'Editar Auditoría' : 'Nueva Auditoría'}
    >
      <Form.Item
        name="name"
        label="Nombre de la Auditoría"
        rules={[{ required: true, message: 'Ingrese el nombre' }]}
        initialValue={audit?.name}
      >
        <Input placeholder="Ej: Auditoría Interna ISO 9001" />
      </Form.Item>

      <Form.Item
        name="type"
        label="Tipo de Auditoría"
        rules={[{ required: true }]}
        initialValue={audit?.type}
      >
        <Select placeholder="Seleccione el tipo">
          <Option value="internal">Interna</Option>
          <Option value="external">Externa</Option>
          <Option value="certification">Certificación</Option>
          <Option value="followUp">Seguimiento</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="standard"
        label="Norma"
        rules={[{ required: true }]}
        initialValue={audit?.standard}
      >
        <Select placeholder="Seleccione la norma">
          <Option value="iso9001">ISO 9001:2015</Option>
          <Option value="iso27001">ISO 27001:2022</Option>
          <Option value="iso20000">ISO 20000:2018</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="scope"
        label="Alcance"
        initialValue={audit?.scope}
      >
        <TextArea rows={3} placeholder="Describa el alcance de la auditoría" />
      </Form.Item>

      <Form.Item
        name="auditor"
        label="Auditor Líder"
        rules={[{ required: true }]}
        initialValue={audit?.auditor}
      >
        <Input prefix={<UserOutlined />} placeholder="Nombre del auditor" />
      </Form.Item>

      <Form.Item
        name="auditTeam"
        label="Equipo Auditor"
        initialValue={audit?.auditTeam}
      >
        <Select mode="multiple" placeholder="Seleccione los auditores">
          <Option value="user1">Usuario 1</Option>
          <Option value="user2">Usuario 2</Option>
          <Option value="user3">Usuario 3</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="auditDate"
        label="Fecha de Auditoría"
        rules={[{ required: true }]}
        initialValue={audit?.auditDate ? dayjs(audit.auditDate) : null}
      >
        <DatePicker className="w-full" format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item
        name="duration"
        label="Duración (días)"
        initialValue={audit?.duration || 1}
      >
        <InputNumber min={1} max={30} className="w-full" />
      </Form.Item>

      <Form.Item
        name="status"
        label="Estado"
        initialValue={audit?.status || 'planned'}
      >
        <Select>
          <Option value="planned">Planificada</Option>
          <Option value="inProgress">En Progreso</Option>
          <Option value="completed">Completada</Option>
          <Option value="cancelled">Cancelada</Option>
        </Select>
      </Form.Item>
    </FormModal>
  );
};

export default AuditForm;