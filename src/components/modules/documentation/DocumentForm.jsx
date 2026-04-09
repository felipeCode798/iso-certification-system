// src/components/modules/documentation/DocumentForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Upload, Button, DatePicker, message, Modal } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useCreateDocumentMutation, useUpdateDocumentMutation } from '../../../services/api/documentationService';

const { TextArea } = Input;
const { Dragger } = Upload;

const DocumentForm = ({ visible, onClose, document = null }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { mutateAsync: createDocument } = useCreateDocumentMutation();
  const { mutateAsync: updateDocument } = useUpdateDocumentMutation();

  useEffect(() => {
    if (visible) {
      if (document) {
        form.setFieldsValue({
          code: document.code,
          title: document.title,
          type: document.type,
          version: document.version,
          status: document.status,
          description: document.description,
          approvalDate: document.approvalDate ? dayjs(document.approvalDate) : null,
          reviewDate: document.reviewDate ? dayjs(document.reviewDate) : null,
          responsible: document.responsible,
        });
      } else {
        form.resetFields();
        setFileList([]);
        // Valores por defecto
        form.setFieldsValue({
          version: '1.0',
          status: 'borrador',
        });
      }
    }
  }, [visible, document, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        code: values.code,
        title: values.title,
        type: values.type,
        version: values.version,
        status: values.status || 'borrador',
        description: values.description || '',
        approvalDate: values.approvalDate ? values.approvalDate.format('YYYY-MM-DD') : null,
        reviewDate: values.reviewDate ? values.reviewDate.format('YYYY-MM-DD') : null,
        responsible: values.responsible || '',
      };

      console.log('📤 Enviando payload:', payload);

      if (document) {
        await updateDocument({ id: document.id, data: payload });
        message.success('Documento actualizado exitosamente');
      } else {
        await createDocument(payload);
        message.success('Documento creado exitosamente');
      }

      form.resetFields();
      setFileList([]);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error.response?.data?.message;
      if (Array.isArray(errorMsg)) {
        message.error(errorMsg.join(', '));
      } else {
        message.error(errorMsg || 'Error al guardar el documento');
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      const isValidSize = file.size / 1024 / 1024 < 10;
      if (!isValidSize) {
        message.error('El archivo debe ser menor a 10MB');
        return false;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    accept: '.pdf,.doc,.docx,.xls,.xlsx',
    maxCount: 1,
  };

  return (
    <Modal
      title={document ? 'Editar Documento' : 'Nuevo Documento'}
      open={visible}
      onCancel={() => {
        form.resetFields();
        setFileList([]);
        onClose();
      }}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="code"
            label="Código"
            rules={[{ required: true, message: 'Ingrese el código' }]}
          >
            <Input placeholder="Ej: DOC-001" />
          </Form.Item>

          <Form.Item
            name="version"
            label="Versión"
            rules={[{ required: true, message: 'Ingrese la versión' }]}
            initialValue="1.0"
          >
            <Input placeholder="Ej: 1.0" />
          </Form.Item>
        </div>

        <Form.Item
          name="title"
          label="Título"
          rules={[{ required: true, message: 'Ingrese el título' }]}
        >
          <Input placeholder="Título del documento" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="type"
            label="Tipo de Documento"
            rules={[{ required: true, message: 'Seleccione el tipo' }]}
          >
            <Select placeholder="Seleccionar tipo">
              <Select.Option value="procedure">Procedimiento</Select.Option>
              <Select.Option value="instruction">Instructivo</Select.Option>
              <Select.Option value="format">Formato</Select.Option>
              <Select.Option value="policy">Política</Select.Option>
              <Select.Option value="manual">Manual</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Estado"
            rules={[{ required: true, message: 'Seleccione el estado' }]}
            initialValue="borrador"
          >
            <Select placeholder="Seleccionar estado">
              <Select.Option value="borrador">Borrador</Select.Option>
              <Select.Option value="revision">En Revisión</Select.Option>
              <Select.Option value="aprobado">Aprobado</Select.Option>
              <Select.Option value="obsoleto">Obsoleto</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item name="approvalDate" label="Fecha de Aprobación">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="reviewDate" label="Próxima Revisión">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
        </div>

        <Form.Item name="responsible" label="Responsable">
          <Input placeholder="Nombre del responsable" />
        </Form.Item>

        <Form.Item name="description" label="Descripción">
          <TextArea rows={3} placeholder="Descripción del documento" />
        </Form.Item>

        <Form.Item label="Archivo (opcional)">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Haga clic o arrastre el archivo aquí</p>
            <p className="ant-upload-hint">PDF, Word, Excel — máximo 10MB</p>
          </Dragger>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DocumentForm;