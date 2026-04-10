import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, TimePicker, Row, Col, Divider, message } from 'antd';
import { UserOutlined, TeamOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import FormModal from '../../common/Modals/FormModal';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const AuditForm = ({ visible, onClose, onSubmit, audit = null, loading = false }) => {
  const [form] = FormModal.useForm();

  useEffect(() => {
    if (visible && audit) {
      // Editar: Cargar datos existentes
      form.setFieldsValue({
        name: audit.name,
        auditCode: audit.auditCode,
        type: audit.type,
        standard: audit.standard,
        status: audit.status,
        scope: audit.scope,
        objectives: audit.objectives,
        auditor: audit.auditor,
        auditTeam: audit.auditTeam,
        auditDate: audit.auditDate ? dayjs(audit.auditDate) : null,
        startTime: audit.startTime ? dayjs(audit.startTime, 'HH:mm') : null,
        endTime: audit.endTime ? dayjs(audit.endTime, 'HH:mm') : null,
        duration: audit.duration,
        location: audit.location,
        department: audit.department,
        criteria: audit.criteria,
        auditee: audit.auditee,
        previousAuditRef: audit.previousAuditRef,
        conclusions: audit.conclusions,
      });
    } else if (visible) {
      // Nuevo: Resetear y establecer valores por defecto
      form.resetFields();
      form.setFieldsValue({
        auditCode: `AUD-${Date.now()}`,
        status: 'planned',
        duration: 1,
        progress: 0,
      });
    }
  }, [visible, audit, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        auditDate: values.auditDate?.format('YYYY-MM-DD'),
        startTime: values.startTime?.format('HH:mm'),
        endTime: values.endTime?.format('HH:mm'),
        // Asegurar tipos correctos
        duration: values.duration ? parseFloat(values.duration) : 1,
        auditTeam: values.auditTeam || [],
        criteria: values.criteria || [],
        // Si es edición, incluir el ID
        ...(audit?.id && { id: audit.id }),
      };
      
      console.log('📤 Enviando auditoría:', JSON.stringify(payload, null, 2));
      
      await onSubmit(payload);
      message.success(audit ? 'Auditoría actualizada' : 'Auditoría creada');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('❌ Error:', error);
      const errorMsg = error.response?.data?.message;
      if (Array.isArray(errorMsg)) {
        message.error(errorMsg.join(', '));
      } else if (typeof errorMsg === 'string') {
        message.error(errorMsg);
      } else {
        message.error('Error al guardar la auditoría');
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
      title={audit ? 'Editar Auditoría' : 'Nueva Auditoría'}
      width={800}
      loading={loading}
      form={form}
    >
      <Row gutter={16}>
        <Col span={12}>
          <FormModal.Item 
            name="name" 
            label="Nombre de la Auditoría" 
            rules={[{ required: true, message: 'El nombre es requerido' }]}
          >
            <Input placeholder="Ej: Auditoría Interna ISO 9001" />
          </FormModal.Item>
        </Col>
        <Col span={12}>
          <FormModal.Item name="auditCode" label="Código de Auditoría">
            <Input placeholder="Ej: AUD-001" disabled={!!audit} />
          </FormModal.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <FormModal.Item 
            name="type" 
            label="Tipo de Auditoría" 
            rules={[{ required: true, message: 'El tipo es requerido' }]}
          >
            <Select placeholder="Seleccione">
              <Option value="internal">Interna</Option>
              <Option value="external">Externa</Option>
              <Option value="certification">Certificación</Option>
              <Option value="followUp">Seguimiento</Option>
            </Select>
          </FormModal.Item>
        </Col>
        <Col span={8}>
          <FormModal.Item 
            name="standard" 
            label="Norma" 
            rules={[{ required: true, message: 'La norma es requerida' }]}
          >
            <Select placeholder="Seleccione">
              <Option value="iso9001">ISO 9001:2015 - Calidad</Option>
              <Option value="iso27001">ISO 27001:2022 - Seguridad</Option>
              <Option value="iso20000">ISO 20000:2018 - Servicios TI</Option>
            </Select>
          </FormModal.Item>
        </Col>
        <Col span={8}>
          <FormModal.Item name="status" label="Estado" initialValue="planned">
            <Select>
              <Option value="planned">Planificada</Option>
              <Option value="inProgress">En Progreso</Option>
              <Option value="completed">Completada</Option>
              <Option value="cancelled">Cancelada</Option>
            </Select>
          </FormModal.Item>
        </Col>
      </Row>

      <FormModal.Item name="scope" label="Alcance de la Auditoría">
        <TextArea rows={2} placeholder="Describa los procesos, áreas y ubicaciones a auditar" />
      </FormModal.Item>

      <FormModal.Item name="objectives" label="Objetivos de la Auditoría">
        <TextArea rows={2} placeholder="Ej: Verificar el cumplimiento de los requisitos normativos" />
      </FormModal.Item>

      <Divider orientation="left">Equipo Auditor</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <FormModal.Item 
            name="auditor" 
            label="Auditor Líder" 
            rules={[{ required: true, message: 'El auditor líder es requerido' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nombre del auditor líder" />
          </FormModal.Item>
        </Col>
        <Col span={12}>
          <FormModal.Item name="auditTeam" label="Equipo Auditor">
            <Select mode="multiple" placeholder="Seleccione auditores">
              <Option value="Juan Pérez">Juan Pérez</Option>
              <Option value="María López">María López</Option>
              <Option value="Carlos Ruiz">Carlos Ruiz</Option>
              <Option value="Ana Martínez">Ana Martínez</Option>
            </Select>
          </FormModal.Item>
        </Col>
      </Row>

      <Divider orientation="left">Fechas y Duración</Divider>

      <Row gutter={16}>
        <Col span={8}>
          <FormModal.Item 
            name="auditDate" 
            label="Fecha de Auditoría" 
            rules={[{ required: true, message: 'La fecha es requerida' }]}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </FormModal.Item>
        </Col>
        <Col span={8}>
          <FormModal.Item name="startTime" label="Hora de Inicio">
            <TimePicker className="w-full" format="HH:mm" />
          </FormModal.Item>
        </Col>
        <Col span={8}>
          <FormModal.Item name="endTime" label="Hora de Fin">
            <TimePicker className="w-full" format="HH:mm" />
          </FormModal.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <FormModal.Item name="duration" label="Duración (días)">
            <InputNumber min={0.5} max={30} step={0.5} className="w-full" />
          </FormModal.Item>
        </Col>
        <Col span={8}>
          <FormModal.Item name="location" label="Ubicación">
            <Input placeholder="Oficina, planta, remoto" />
          </FormModal.Item>
        </Col>
        <Col span={8}>
          <FormModal.Item name="department" label="Departamento/Área">
            <Input placeholder="Área a auditar" />
          </FormModal.Item>
        </Col>
      </Row>

      <Divider orientation="left">Información Adicional</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <FormModal.Item name="criteria" label="Criterios de Auditoría">
            <Select placeholder="Seleccione criterios" mode="multiple">
              <Option value="iso9001:4">ISO 9001:2015 - Cláusula 4</Option>
              <Option value="iso9001:5">ISO 9001:2015 - Cláusula 5</Option>
              <Option value="iso9001:6">ISO 9001:2015 - Cláusula 6</Option>
              <Option value="iso9001:7">ISO 9001:2015 - Cláusula 7</Option>
              <Option value="iso9001:8">ISO 9001:2015 - Cláusula 8</Option>
              <Option value="iso9001:9">ISO 9001:2015 - Cláusula 9</Option>
              <Option value="iso9001:10">ISO 9001:2015 - Cláusula 10</Option>
            </Select>
          </FormModal.Item>
        </Col>
        <Col span={12}>
          <FormModal.Item name="auditee" label="Auditado/Representante">
            <Input placeholder="Persona o área a auditar" />
          </FormModal.Item>
        </Col>
      </Row>

      <FormModal.Item name="previousAuditRef" label="Referencia a Auditoría Anterior">
        <Input placeholder="Número de auditoría previa" />
      </FormModal.Item>

      <FormModal.Item name="conclusions" label="Conclusiones">
        <TextArea rows={3} placeholder="Conclusiones de la auditoría" />
      </FormModal.Item>
    </FormModal>
  );
};

export default AuditForm;