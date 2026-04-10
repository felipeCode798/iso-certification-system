// src/components/modules/risks/RiskForm.jsx
import React, { useEffect } from 'react';
import { Input, Select, DatePicker } from 'antd';
import FormModal from '../../common/Modals/FormModal';
import dayjs from 'dayjs';

const { TextArea } = Input;

const categoryOptions = [
  { value: 'strategic',     label: 'Estratégico'       },
  { value: 'operational',   label: 'Operacional'       },
  { value: 'financial',     label: 'Financiero'        },
  { value: 'technological', label: 'Tecnológico'       },
  { value: 'legal',         label: 'Legal / Compliance'},
];

const treatmentOptions = [
  { value: 'Evitar',    label: 'Evitar'    },
  { value: 'Mitigar',   label: 'Mitigar'   },
  { value: 'Transferir',label: 'Transferir'},
  { value: 'Aceptar',   label: 'Aceptar'   },
  { value: 'Controlar', label: 'Controlar' },
];

const standardOptions = [
  { value: 'iso9001',  label: 'ISO 9001'  },
  { value: 'iso27001', label: 'ISO 27001' },
  { value: 'iso20000', label: 'ISO 20000' },
];

const RiskForm = ({ visible, onClose, onSubmit, risk = null, loading = false }) => {
  const [form] = FormModal.useForm();

  useEffect(() => {
    if (visible && risk) {
      form.setFieldsValue({
        name: risk.name,
        category: risk.category,
        standard: risk.standard,
        description: risk.description,
        cause: risk.cause,
        effect: risk.effect,
        probability: risk.probability,
        impact: risk.impact,
        treatment: risk.treatment,
        mitigationPlan: risk.mitigationPlan,
        responsible: risk.responsible,
        identificationDate: risk.identificationDate ? dayjs(risk.identificationDate) : dayjs(),
        reviewDate: risk.reviewDate ? dayjs(risk.reviewDate) : null,
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({ 
        identificationDate: dayjs(),
        probability: 1,
        impact: 1,
      });
    }
  }, [visible, risk, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        category: values.category,
        standard: values.standard,
        description: values.description,
        cause: values.cause,
        effect: values.effect,
        probability: values.probability,
        impact: values.impact,
        treatment: values.treatment,
        mitigationPlan: values.mitigationPlan,
        responsible: values.responsible,
        identificationDate: values.identificationDate?.format('YYYY-MM-DD'),
        reviewDate: values.reviewDate?.format('YYYY-MM-DD'),
        ...(risk?.id && { id: risk.id }),
      };
      
      console.log('📤 Enviando riesgo:', payload);
      await onSubmit(payload);
      form.resetFields();
    } catch (error) {
      console.error('Error:', error);
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
      title={risk ? 'Editar Riesgo' : 'Identificar Nuevo Riesgo'}
      width={680}
      loading={loading}
      form={form}
    >
      {/* 👇 IMPORTANTE: NO usar <Form> aquí, FormModal ya provee el formulario */}
      <FormModal.Item name="name" label="Nombre del Riesgo" rules={[{ required: true, message: 'Requerido' }]}>
        <Input placeholder="Ej: Pérdida de información crítica" />
      </FormModal.Item>

      <div className="grid grid-cols-2 gap-x-4">
        <FormModal.Item name="category" label="Categoría" rules={[{ required: true, message: 'Requerido' }]}>
          <Select placeholder="Seleccionar" options={categoryOptions} />
        </FormModal.Item>
        <FormModal.Item name="standard" label="Norma Relacionada">
          <Select placeholder="Seleccionar" options={standardOptions} allowClear />
        </FormModal.Item>
      </div>

      <FormModal.Item name="description" label="Descripción">
        <TextArea rows={2} placeholder="Describa el riesgo en detalle" />
      </FormModal.Item>

      <div className="grid grid-cols-2 gap-x-4">
        <FormModal.Item name="cause" label="Causa">
          <Input placeholder="¿Qué puede causar este riesgo?" />
        </FormModal.Item>
        <FormModal.Item name="effect" label="Efecto">
          <Input placeholder="¿Cuál sería el impacto si ocurre?" />
        </FormModal.Item>
      </div>

      <div className="grid grid-cols-3 gap-x-4">
        <FormModal.Item name="probability" label="Probabilidad (1-5)" rules={[{ required: true }]}>
          <Select placeholder="Valor">
            {[1,2,3,4,5].map(n => (
              <Select.Option key={n} value={n}>
                {n} — {['Muy baja','Baja','Media','Alta','Muy alta'][n-1]}
              </Select.Option>
            ))}
          </Select>
        </FormModal.Item>
        <FormModal.Item name="impact" label="Impacto (1-5)" rules={[{ required: true }]}>
          <Select placeholder="Valor">
            {[1,2,3,4,5].map(n => (
              <Select.Option key={n} value={n}>
                {n} — {['Muy bajo','Bajo','Medio','Alto','Muy alto'][n-1]}
              </Select.Option>
            ))}
          </Select>
        </FormModal.Item>
        <FormModal.Item name="treatment" label="Tratamiento" rules={[{ required: true }]}>
          <Select placeholder="Seleccionar" options={treatmentOptions} />
        </FormModal.Item>
      </div>

      <FormModal.Item name="mitigationPlan" label="Plan de Mitigación">
        <TextArea rows={2} placeholder="Acciones para mitigar el riesgo" />
      </FormModal.Item>

      <div className="grid grid-cols-3 gap-x-4">
        <FormModal.Item name="responsible" label="Responsable">
          <Input placeholder="Nombre del responsable" />
        </FormModal.Item>
        <FormModal.Item name="identificationDate" label="F. Identificación">
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </FormModal.Item>
        <FormModal.Item name="reviewDate" label="F. Revisión">
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </FormModal.Item>
      </div>
    </FormModal>
  );
};

export default RiskForm;