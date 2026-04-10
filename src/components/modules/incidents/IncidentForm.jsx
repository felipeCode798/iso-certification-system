import React, { useEffect } from 'react';
import { Input, Select, DatePicker, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import FormModal from '../../common/Modals/FormModal';

const { TextArea } = Input;

const severityOptions = [
  { value: 'critical', label: '🔴 Crítico — Impacto en toda la organización' },
  { value: 'high', label: '🟠 Alto — Impacto significativo' },
  { value: 'medium', label: '🟡 Medio — Impacto moderado' },
  { value: 'low', label: '🟢 Bajo — Impacto menor' },
];

const categoryOptions = [
  { value: 'technical', label: 'Técnico' },
  { value: 'process', label: 'Proceso' },
  { value: 'security', label: 'Seguridad' },
  { value: 'service', label: 'Servicio' },
  { value: 'quality', label: 'Calidad' },
];

const standardOptions = [
  { value: 'iso9001', label: 'ISO 9001' },
  { value: 'iso27001', label: 'ISO 27001' },
  { value: 'iso20000', label: 'ISO 20000' },
];

const IncidentForm = ({ visible, onClose, onSubmit, incident = null }) => {
  const [form] = FormModal.useForm(); // Usar FormModal.useForm en lugar de Form.useForm
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (visible && incident) {
      // EDITAR: Cargar datos existentes
      form.setFieldsValue({
        title: incident.title,
        severity: incident.severity,
        category: incident.category,
        standard: incident.standard,
        description: incident.description,
        impact: incident.impact || '',
        workaround: incident.workaround || '',
        reportedBy: incident.reportedBy,
        assignedTo: incident.assignedTo,
        slaTime: incident.slaTime,
        reportedDate: incident.reportedDate ? dayjs(incident.reportedDate) : dayjs(),
      });
    } else if (visible) {
      // NUEVO: Resetear y establecer valores por defecto
      form.resetFields();
      form.setFieldsValue({
        reportedDate: dayjs(),
        severity: 'medium',
        category: 'technical',
      });
    }
  }, [visible, incident, form]);

  // Esta función recibe los valores validados del formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Los valores YA VIENEN del formulario con todos los campos
      // Solo necesitas asegurar que los tipos sean correctos
      const payload = {
        ...values,
        // Asegurar tipos correctos
        slaTime: values.slaTime ? parseInt(values.slaTime) : null,
        reportedDate: values.reportedDate ? values.reportedDate.toISOString() : new Date().toISOString(),
        // Asegurar que strings vacíos se envíen como null o string vacío según el backend
        impact: values.impact || '',
        workaround: values.workaround || '',
        assignedTo: values.assignedTo || null,
        standard: values.standard || null,
      };
      
      console.log('📤 Enviando incidente:', JSON.stringify(payload, null, 2));
      
      if (incident?.id) {
        await onSubmit({ id: incident.id, ...payload });
      } else {
        await onSubmit(payload);
      }
      
      message.success(incident ? 'Incidente actualizado' : 'Incidente registrado');
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
        message.error('Error al guardar el incidente');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      visible={visible}
      onCancel={onClose}
      onSubmit={handleSubmit}
      title={incident ? 'Editar Incidente' : 'Reportar Nuevo Incidente'}
      width={720}
      loading={loading}
      form={form} // 👈 IMPORTANTE: Pasar el form al modal
    >
      <FormModal.Item 
        name="title" 
        label="Título del Incidente" 
        rules={[{ required: true, message: 'El título es requerido' }]}
      >
        <Input placeholder="Ej: Caída del sistema de facturación" />
      </FormModal.Item>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <FormModal.Item 
          name="severity" 
          label="Severidad" 
          rules={[{ required: true, message: 'La severidad es requerida' }]}
        >
          <Select placeholder="Seleccionar" options={severityOptions} />
        </FormModal.Item>
        
        <FormModal.Item 
          name="category" 
          label="Categoría" 
          rules={[{ required: true, message: 'La categoría es requerida' }]}
        >
          <Select placeholder="Seleccionar" options={categoryOptions} />
        </FormModal.Item>
        
        <FormModal.Item name="standard" label="Norma Relacionada">
          <Select placeholder="Seleccionar" options={standardOptions} allowClear />
        </FormModal.Item>
      </div>

      <FormModal.Item 
        name="description" 
        label="Descripción Detallada" 
        rules={[{ required: true, message: 'La descripción es requerida' }]}
      >
        <TextArea rows={3} placeholder="Describa el incidente en detalle" />
      </FormModal.Item>

      <FormModal.Item name="impact" label="Impacto en el Negocio">
        <TextArea rows={2} placeholder="¿Qué procesos, usuarios o sistemas se ven afectados?" />
      </FormModal.Item>

      <FormModal.Item name="workaround" label="Solución Temporal (Workaround)">
        <TextArea rows={2} placeholder="¿Existe alguna solución temporal mientras se resuelve?" />
      </FormModal.Item>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <FormModal.Item 
          name="reportedBy" 
          label="Reportado por" 
          rules={[{ required: true, message: 'Nombre de quien reporta es requerido' }]}
        >
          <Input placeholder="Nombre de quien reporta" />
        </FormModal.Item>
        
        <FormModal.Item name="assignedTo" label="Asignado a">
          <Input placeholder="Responsable de resolución" />
        </FormModal.Item>
        
        <FormModal.Item name="slaTime" label="SLA (horas)">
          <Input type="number" min={1} placeholder="Ej: 4" />
        </FormModal.Item>
      </div>

      <FormModal.Item 
        name="reportedDate" 
        label="Fecha y Hora del Incidente" 
        rules={[{ required: true, message: 'La fecha es requerida' }]}
      >
        <DatePicker showTime style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
      </FormModal.Item>

      <FormModal.Item label="Archivos Adjuntos (opcional)">
        <Upload beforeUpload={() => false} multiple>
          <Button icon={<UploadOutlined />}>Adjuntar evidencia</Button>
        </Upload>
      </FormModal.Item>
    </FormModal>
  );
};

export default IncidentForm;