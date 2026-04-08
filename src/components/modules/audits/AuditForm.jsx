// src/components/modules/audits/AuditForm.jsx
import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, TimePicker, Row, Col, Divider } from 'antd';
import { UserOutlined, TeamOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
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
      startTime: values.startTime?.format('HH:mm'),
      endTime: values.endTime?.format('HH:mm'),
      id: audit?.id,
      status: audit?.status || 'planned',
      progress: audit?.progress || 0,
    };
    await onSubmit(auditData);
    form.resetFields();
  };

  return (
    <FormModal visible={visible} onCancel={onClose} onSubmit={handleSubmit} title={audit ? 'Editar Auditoría' : 'Nueva Auditoría'} width={800}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="name" label="Nombre de la Auditoría" rules={[{ required: true }]} initialValue={audit?.name}>
            <Input placeholder="Ej: Auditoría Interna ISO 9001" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="auditCode" label="Código de Auditoría" initialValue={audit?.auditCode || `AUD-${Date.now()}`}>
            <Input placeholder="Ej: AUD-001" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="type" label="Tipo de Auditoría" rules={[{ required: true }]} initialValue={audit?.type}>
            <Select placeholder="Seleccione">
              <Option value="internal">Interna</Option>
              <Option value="external">Externa</Option>
              <Option value="certification">Certificación</Option>
              <Option value="followUp">Seguimiento</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="standard" label="Norma" rules={[{ required: true }]} initialValue={audit?.standard}>
            <Select placeholder="Seleccione">
              <Option value="iso9001">ISO 9001:2015 - Calidad</Option>
              <Option value="iso27001">ISO 27001:2022 - Seguridad</Option>
              <Option value="iso20000">ISO 20000:2018 - Servicios TI</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="status" label="Estado" initialValue={audit?.status || 'planned'}>
            <Select>
              <Option value="planned">Planificada</Option>
              <Option value="inProgress">En Progreso</Option>
              <Option value="completed">Completada</Option>
              <Option value="cancelled">Cancelada</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="scope" label="Alcance de la Auditoría" initialValue={audit?.scope}>
        <TextArea rows={2} placeholder="Describa los procesos, áreas y ubicaciones a auditar" />
      </Form.Item>

      <Form.Item name="objectives" label="Objetivos de la Auditoría" initialValue={audit?.objectives}>
        <TextArea rows={2} placeholder="Ej: Verificar el cumplimiento de los requisitos normativos" />
      </Form.Item>

      <Divider orientation="left">Equipo Auditor</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="auditor" label="Auditor Líder" rules={[{ required: true }]} initialValue={audit?.auditor}>
            <Input prefix={<UserOutlined />} placeholder="Nombre del auditor líder" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="auditTeam" label="Equipo Auditor" initialValue={audit?.auditTeam}>
            <Select mode="multiple" placeholder="Seleccione auditores">
              <Option value="user1">Juan Pérez</Option>
              <Option value="user2">María López</Option>
              <Option value="user3">Carlos Ruiz</Option>
              <Option value="user4">Ana Martínez</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Fechas y Duración</Divider>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="auditDate" label="Fecha de Auditoría" rules={[{ required: true }]} initialValue={audit?.auditDate ? dayjs(audit.auditDate) : null}>
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="startTime" label="Hora de Inicio" initialValue={audit?.startTime ? dayjs(audit.startTime, 'HH:mm') : null}>
            <TimePicker className="w-full" format="HH:mm" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="endTime" label="Hora de Fin" initialValue={audit?.endTime ? dayjs(audit.endTime, 'HH:mm') : null}>
            <TimePicker className="w-full" format="HH:mm" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="duration" label="Duración (días)" initialValue={audit?.duration || 1}>
            <InputNumber min={0.5} max={30} step={0.5} className="w-full" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="location" label="Ubicación" initialValue={audit?.location}>
            <Input placeholder="Oficina, planta, remoto" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="department" label="Departamento/Área" initialValue={audit?.department}>
            <Input placeholder="Área a auditar" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Información Adicional</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="criteria" label="Criterios de Auditoría" initialValue={audit?.criteria}>
            <Select placeholder="Seleccione criterios" mode="multiple">
              <Option value="iso9001:4">ISO 9001:2015 - Cláusula 4</Option>
              <Option value="iso9001:5">ISO 9001:2015 - Cláusula 5</Option>
              <Option value="iso9001:6">ISO 9001:2015 - Cláusula 6</Option>
              <Option value="iso9001:7">ISO 9001:2015 - Cláusula 7</Option>
              <Option value="iso9001:8">ISO 9001:2015 - Cláusula 8</Option>
              <Option value="iso9001:9">ISO 9001:2015 - Cláusula 9</Option>
              <Option value="iso9001:10">ISO 9001:2015 - Cláusula 10</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="auditee" label="Auditado/Representante" initialValue={audit?.auditee}>
            <Input placeholder="Persona o área a auditar" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="previousAuditRef" label="Referencia a Auditoría Anterior" initialValue={audit?.previousAuditRef}>
        <Input placeholder="Número de auditoría previa" />
      </Form.Item>
    </FormModal>
  );
};

export default AuditForm;