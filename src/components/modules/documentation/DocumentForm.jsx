import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Upload, Button, DatePicker, InputNumber, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import FormModal from '../../common/Modals/FormModal';
import { useCreateDocumentMutation, useUpdateDocumentMutation } from '../../../services/api/documentationService';

const { TextArea } = Input;
const { Dragger } = Upload;

const DocumentForm = ({ visible, onClose, document = null }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // ✅ FIX: useMutation retorna objeto, no array
  const { mutateAsync: createDocument, isLoading: creating } = useCreateDocumentMutation();
  const { mutateAsync: updateDocument, isLoading: updating } = useUpdateDocumentMutation();

  // Rellenar el form al editar
  useEffect(() => {
    if (visible && document) {
      form.setFieldsValue({
        ...document,
        approvalDate: document.approvalDate ? dayjs(document.approvalDate) : null,
        reviewDate: document.reviewDate ? dayjs(document.reviewDate) : null,
      });
    } else if (visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, document, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        approvalDate: values.approvalDate?.format('YYYY-MM-DD'),
        reviewDate: values.reviewDate?.format('YYYY-MM-DD'),
        file: fileList[0]?.originFileObj || null,
      };

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
      message.error('Error al guardar el documento');
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
      return false; // Evitar upload automático
    },
    fileList,
    accept: '.pdf,.doc,.docx,.xls,.xlsx',
    maxCount: 1,
  };

  return (
    <FormModal
      visible={visible}
      onCancel={onClose}
      onSubmit={handleSubmit}
      title={document ? 'Editar Documento' : 'Nuevo Documento'}
      width={700}
      confirmLoading={creating || updating}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-x-4">
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

        <div className="grid grid-cols-2 gap-x-4">
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
          >
            <Select placeholder="Seleccionar estado">
              <Select.Option value="borrador">Borrador</Select.Option>
              <Select.Option value="revision">En Revisión</Select.Option>
              <Select.Option value="aprobado">Aprobado</Select.Option>
              <Select.Option value="obsoleto">Obsoleto</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item name="approvalDate" label="Fecha de Aprobación">
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="reviewDate" label="Próxima Revisión">
            <DatePicker className="w-full" format="DD/MM/YYYY" />
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
      </Form>
    </FormModal>
  );
};

export default DocumentForm;