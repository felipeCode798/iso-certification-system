// src/components/modules/nonconformities/NCForm.jsx
import React from 'react';
import { Form, Input, Select, DatePicker, Upload, Button, Space, Row, Col } from 'antd';
import { UploadOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import FormModal from '../../common/Modals/FormModal';

const { TextArea } = Input;

const NCForm = ({ visible, onClose, onSubmit, nc = null }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const ncData = {
      ...values,
      detectionDate: values.detectionDate?.format('YYYY-MM-DD'),
      progress: nc?.progress || 0,
      status: nc?.status || 'open',
      id: nc?.id,
    };
    await onSubmit(ncData);
    form.resetFields();
  };

  return (
    <FormModal
      visible={visible}
      onCancel={onClose}
      onSubmit={handleSubmit}
      title={nc ? 'Editar No Conformidad' : 'Registrar No Conformidad'}
      width={800}
    >
      <Form.Item
        name="description"
        label="Descripción de la No Conformidad"
        rules={[{ required: true, message: 'Ingrese la descripción' }]}
        initialValue={nc?.description}
      >
        <TextArea rows={3} placeholder="Describa la no conformidad encontrada" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="severity" label="Severidad" rules={[{ required: true }]} initialValue={nc?.severity}>
            <Select>
              <Select.Option value="critical"><WarningOutlined className="text-red-500" /> Crítica - Impacto en la certificación</Select.Option>
              <Select.Option value="major">Mayor - Impacto significativo</Select.Option>
              <Select.Option value="minor">Menor - Impacto limitado</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="source" label="Origen" rules={[{ required: true }]} initialValue={nc?.source}>
            <Select>
              <Select.Option value="audit">Auditoría</Select.Option>
              <Select.Option value="internal">Inspección Interna</Select.Option>
              <Select.Option value="client">Reclamo de Cliente</Select.Option>
              <Select.Option value="process">Monitoreo de Proceso</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="standard" label="Norma Afectada" initialValue={nc?.standard}>
            <Select>
              <Select.Option value="iso9001">ISO 9001:2015 - Calidad</Select.Option>
              <Select.Option value="iso27001">ISO 27001:2022 - Seguridad</Select.Option>
              <Select.Option value="iso20000">ISO 20000:2018 - Servicios TI</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="clause" label="Cláusula/Requisito" initialValue={nc?.clause}>
            <Input placeholder="Ej: 8.2.2" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="detectedBy" label="Detectado por" rules={[{ required: true }]} initialValue={nc?.detectedBy}>
            <Input placeholder="Nombre de quien detectó" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="detectionDate" label="Fecha de Detección" rules={[{ required: true }]} initialValue={nc?.detectionDate ? dayjs(nc.detectionDate) : dayjs()}>
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="immediateAction" label="Acción Inmediata Tomada" initialValue={nc?.immediateAction}>
        <TextArea rows={2} placeholder="Acción correctiva inmediata implementada" />
      </Form.Item>

      <Form.Item name="evidence" label="Evidencias">
        <Upload beforeUpload={() => false} multiple>
          <Button icon={<UploadOutlined />}>Subir evidencias</Button>
        </Upload>
      </Form.Item>
    </FormModal>
  );
};

export default NCForm;