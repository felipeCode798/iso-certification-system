// src/components/modules/nonconformities/NCForm.jsx
import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, Upload, Button, Space, Row, Col, message } from 'antd';
import { UploadOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import FormModal from '../../common/Modals/FormModal';

const { TextArea } = Input;

const NCForm = ({ visible, onClose, onSubmit, nc = null, loading = false }) => {
  const [form] = FormModal.useForm();

  useEffect(() => {
    if (visible && nc) {
      form.setFieldsValue({
        description: nc.description,
        severity: nc.severity,
        source: nc.source,
        standard: nc.standard,
        clause: nc.clause,
        detectedBy: nc.detectedBy,
        detectionDate: nc.detectionDate ? dayjs(nc.detectionDate) : dayjs(),
        immediateAction: nc.immediateAction,
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({
        detectionDate: dayjs(),
        severity: 'minor',
        source: 'internal',
      });
    }
  }, [visible, nc, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        detectionDate: values.detectionDate?.format('YYYY-MM-DD'),
        ...(nc?.id && { id: nc.id }),
      };
      
      console.log('📤 Enviando NC:', JSON.stringify(payload, null, 2));
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
      title={nc ? 'Editar No Conformidad' : 'Registrar No Conformidad'}
      width={800}
      loading={loading}
      form={form}
    >
      <FormModal.Item
        name="description"
        label="Descripción de la No Conformidad"
        rules={[{ required: true, message: 'Ingrese la descripción' }]}
      >
        <TextArea rows={3} placeholder="Describa la no conformidad encontrada" />
      </FormModal.Item>

      <Row gutter={16}>
        <Col span={8}>
          <FormModal.Item 
            name="severity" 
            label="Severidad" 
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="critical">
                <WarningOutlined className="text-red-500" /> Crítica
              </Select.Option>
              <Select.Option value="major">Mayor</Select.Option>
              <Select.Option value="minor">Menor</Select.Option>
            </Select>
          </FormModal.Item>
        </Col>
        <Col span={8}>
          <FormModal.Item 
            name="source" 
            label="Origen" 
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="audit">Auditoría</Select.Option>
              <Select.Option value="internal">Inspección Interna</Select.Option>
              <Select.Option value="client">Reclamo de Cliente</Select.Option>
              <Select.Option value="process">Monitoreo de Proceso</Select.Option>
            </Select>
          </FormModal.Item>
        </Col>
        <Col span={8}>
          <FormModal.Item name="standard" label="Norma Afectada">
            <Select allowClear>
              <Select.Option value="iso9001">ISO 9001:2015 - Calidad</Select.Option>
              <Select.Option value="iso27001">ISO 27001:2022 - Seguridad</Select.Option>
              <Select.Option value="iso20000">ISO 20000:2018 - Servicios TI</Select.Option>
            </Select>
          </FormModal.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <FormModal.Item name="clause" label="Cláusula/Requisito">
            <Input placeholder="Ej: 8.2.2" />
          </FormModal.Item>
        </Col>
        <Col span={8}>
          <FormModal.Item 
            name="detectedBy" 
            label="Detectado por" 
            rules={[{ required: true }]}
          >
            <Input placeholder="Nombre de quien detectó" />
          </FormModal.Item>
        </Col>
        <Col span={8}>
          <FormModal.Item 
            name="detectionDate" 
            label="Fecha de Detección" 
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </FormModal.Item>
        </Col>
      </Row>

      <FormModal.Item name="immediateAction" label="Acción Inmediata Tomada">
        <TextArea rows={2} placeholder="Acción correctiva inmediata implementada" />
      </FormModal.Item>

      <FormModal.Item label="Evidencias">
        <Upload beforeUpload={() => false} multiple>
          <Button icon={<UploadOutlined />}>Subir evidencias</Button>
        </Upload>
      </FormModal.Item>
    </FormModal>
  );
};

export default NCForm;