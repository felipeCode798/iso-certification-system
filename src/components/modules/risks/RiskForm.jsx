import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
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

const RiskForm = ({ visible, onClose, onSubmit, risk = null }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && risk) {
      form.setFieldsValue({
        ...risk,
        identificationDate: risk.identificationDate ? dayjs(risk.identificationDate) : dayjs(),
        reviewDate: risk.reviewDate ? dayjs(risk.reviewDate) : null,
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({ identificationDate: dayjs() });
    }
  }, [visible, risk, form]);

  const handleSubmit = async (values) => {
    await onSubmit({
      ...values,
      id: risk?.id,
      identificationDate: values.identificationDate?.format('YYYY-MM-DD'),
      reviewDate: values.reviewDate?.format('YYYY-MM-DD'),
      riskLevel: (values.probability || 1) * (values.impact || 1),
    });
    form.resetFields();
  };

  return (
    <FormModal
      visible={visible}
      onCancel={onClose}
      onSubmit={handleSubmit}
      title={risk ? 'Editar Riesgo' : 'Identificar Nuevo Riesgo'}
      width={680}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Nombre del Riesgo" rules={[{ required: true, message: 'Requerido' }]}>
          <Input placeholder="Ej: Pérdida de información crítica" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item name="category" label="Categoría" rules={[{ required: true, message: 'Requerido' }]}>
            <Select placeholder="Seleccionar" options={categoryOptions} />
          </Form.Item>
          <Form.Item name="standard" label="Norma Relacionada">
            <Select placeholder="Seleccionar" options={standardOptions} />
          </Form.Item>
        </div>

        <Form.Item name="description" label="Descripción">
          <TextArea rows={2} placeholder="Describa el riesgo en detalle" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item name="cause" label="Causa">
            <Input placeholder="¿Qué puede causar este riesgo?" />
          </Form.Item>
          <Form.Item name="effect" label="Efecto">
            <Input placeholder="¿Cuál sería el impacto si ocurre?" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-3 gap-x-4">
          <Form.Item name="probability" label="Probabilidad (1-5)" rules={[{ required: true }]}>
            <Select placeholder="Valor">
              {[1,2,3,4,5].map(n => <Select.Option key={n} value={n}>{n} — {['Muy baja','Baja','Media','Alta','Muy alta'][n-1]}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="impact" label="Impacto (1-5)" rules={[{ required: true }]}>
            <Select placeholder="Valor">
              {[1,2,3,4,5].map(n => <Select.Option key={n} value={n}>{n} — {['Muy bajo','Bajo','Medio','Alto','Muy alto'][n-1]}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="treatment" label="Tratamiento" rules={[{ required: true }]}>
            <Select placeholder="Seleccionar" options={treatmentOptions} />
          </Form.Item>
        </div>

        <Form.Item name="mitigationPlan" label="Plan de Mitigación">
          <TextArea rows={2} placeholder="Acciones para mitigar el riesgo" />
        </Form.Item>

        <div className="grid grid-cols-3 gap-x-4">
          <Form.Item name="responsible" label="Responsable">
            <Input placeholder="Nombre del responsable" />
          </Form.Item>
          <Form.Item name="identificationDate" label="F. Identificación">
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="reviewDate" label="F. Revisión">
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
        </div>
      </Form>
    </FormModal>
  );
};

export default RiskForm;