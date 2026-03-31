import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import FormModal from '../../common/Modals/FormModal';

const { TextArea } = Input;

const severityOptions = [
  { value: 'critical', label: '🔴 Crítico — Impacto en toda la organización' },
  { value: 'high',     label: '🟠 Alto — Impacto significativo'              },
  { value: 'medium',   label: '🟡 Medio — Impacto moderado'                 },
  { value: 'low',      label: '🟢 Bajo — Impacto menor'                     },
];

const categoryOptions = [
  { value: 'technical', label: 'Técnico'   },
  { value: 'process',   label: 'Proceso'   },
  { value: 'security',  label: 'Seguridad' },
  { value: 'service',   label: 'Servicio'  },
  { value: 'quality',   label: 'Calidad'   },
];

const standardOptions = [
  { value: 'iso9001',  label: 'ISO 9001'  },
  { value: 'iso27001', label: 'ISO 27001' },
  { value: 'iso20000', label: 'ISO 20000' },
];

const IncidentForm = ({ visible, onClose, onSubmit, incident = null }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && incident) {
      form.setFieldsValue({
        ...incident,
        reportedDate: incident.reportedDate ? dayjs(incident.reportedDate) : dayjs(),
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({ reportedDate: dayjs() });
    }
  }, [visible, incident, form]);

  const handleSubmit = async (values) => {
    await onSubmit({
      ...values,
      id: incident?.id,
      reportedDate: values.reportedDate?.format('YYYY-MM-DD HH:mm'),
    });
    form.resetFields();
  };

  return (
    <FormModal
      visible={visible}
      onCancel={onClose}
      onSubmit={handleSubmit}
      title={incident ? 'Editar Incidente' : 'Reportar Nuevo Incidente'}
      width={720}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Título del Incidente" rules={[{ required: true, message: 'Requerido' }]}>
          <Input placeholder="Ej: Caída del sistema de facturación" />
        </Form.Item>

        <div className="grid grid-cols-3 gap-x-4">
          <Form.Item name="severity" label="Severidad" rules={[{ required: true, message: 'Requerido' }]}>
            <Select placeholder="Seleccionar" options={severityOptions} />
          </Form.Item>
          <Form.Item name="category" label="Categoría" rules={[{ required: true, message: 'Requerido' }]}>
            <Select placeholder="Seleccionar" options={categoryOptions} />
          </Form.Item>
          <Form.Item name="standard" label="Norma Relacionada">
            <Select placeholder="Seleccionar" options={standardOptions} allowClear />
          </Form.Item>
        </div>

        <Form.Item name="description" label="Descripción Detallada" rules={[{ required: true, message: 'Requerido' }]}>
          <TextArea rows={3} placeholder="Describa el incidente en detalle" />
        </Form.Item>

        <Form.Item name="impact" label="Impacto en el Negocio">
          <TextArea rows={2} placeholder="¿Qué procesos, usuarios o sistemas se ven afectados?" />
        </Form.Item>

        <Form.Item name="workaround" label="Solución Temporal (Workaround)">
          <TextArea rows={2} placeholder="¿Existe alguna solución temporal mientras se resuelve?" />
        </Form.Item>

        <div className="grid grid-cols-3 gap-x-4">
          <Form.Item name="reportedBy" label="Reportado por" rules={[{ required: true, message: 'Requerido' }]}>
            <Input placeholder="Nombre" />
          </Form.Item>
          <Form.Item name="assignedTo" label="Asignado a">
            <Input placeholder="Responsable de resolución" />
          </Form.Item>
          <Form.Item name="slaTime" label="SLA (horas)">
            <Input type="number" min={1} placeholder="Ej: 4" />
          </Form.Item>
        </div>

        <Form.Item name="reportedDate" label="Fecha y Hora del Incidente" rules={[{ required: true }]}>
          <DatePicker showTime className="w-full" format="DD/MM/YYYY HH:mm" />
        </Form.Item>

        <Form.Item label="Archivos Adjuntos (opcional)">
          <Upload beforeUpload={() => false} multiple>
            <Button icon={<UploadOutlined />}>Adjuntar evidencia</Button>
          </Upload>
        </Form.Item>
      </Form>
    </FormModal>
  );
};

export default IncidentForm;