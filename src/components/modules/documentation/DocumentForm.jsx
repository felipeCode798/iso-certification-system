// src/components/modules/documentation/DocumentForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Upload, Button, DatePicker, message, Modal } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useCreateDocumentMutation, useUpdateDocumentMutation } from '../../../services/api/documentationService';
import apiClient from '../../../services/api/apiClient';

const { TextArea } = Input;
const { Dragger } = Upload;

// Constantes extraídas para reutilización
const DOCUMENT_TYPES = [
  { value: 'procedure', label: 'Procedimiento' },
  { value: 'instruction', label: 'Instructivo' },
  { value: 'format', label: 'Formato' },
  { value: 'policy', label: 'Política' },
  { value: 'manual', label: 'Manual' },
];

const DOCUMENT_STATUSES = [
  { value: 'borrador', label: 'Borrador' },
  { value: 'revision', label: 'En Revisión' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'obsoleto', label: 'Obsoleto' },
];

// Regex para validar formato de código: letras mayúsculas + guión + números (ej: DOC-001)
const CODE_REGEX = /^[A-Z]{2,10}-\d{3,6}$/;

const DocumentForm = ({ visible, onClose, document: docData = null }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { mutateAsync: createDocument } = useCreateDocumentMutation();
  const { mutateAsync: updateDocument } = useUpdateDocumentMutation();

  // Función para subir archivo al servidor
  const uploadFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = response.data?.data || response.data;
      return {
        fileName: data.fileName,
        originalName: data.originalName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        fileType: data.fileType,
      };
    } catch (error) {
      console.error('Error al subir archivo:', error);
      message.error('Error al subir el archivo');
      return null;
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!visible) return;

    if (docData) {
      // Modo edición: cargar datos existentes
      form.setFieldsValue({
        code: docData.code,
        title: docData.title,
        type: docData.type,
        version: docData.version,
        status: docData.status,
        description: docData.description,
        approvalDate: docData.approvalDate ? dayjs(docData.approvalDate) : null,
        reviewDate: docData.reviewDate ? dayjs(docData.reviewDate) : null,
        responsible: docData.responsible,
      });
      if (docData.fileName) {
        setFileList([{ name: docData.fileName, status: 'done', url: docData.fileUrl }]);
      }
    } else {
      // Modo creación: resetear formulario
      form.resetFields();
      setFileList([]);
      form.setFieldsValue({ 
        version: '1.0', 
        status: 'borrador' 
      });
    }
  }, [visible, docData, form]);

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let fileInfo = null;
      
      // Subir archivo si hay uno nuevo
      if (fileList.length > 0 && fileList[0].originFileObj) {
        fileInfo = await uploadFile(fileList[0].originFileObj);
        if (!fileInfo) {
          setLoading(false);
          return;
        }
      }

      const payload = {
        code: values.code.toUpperCase(),
        title: values.title.trim(),
        type: values.type,
        version: values.version,
        status: values.status || 'borrador',
        description: values.description?.trim() || '',
        approvalDate: values.approvalDate?.format('YYYY-MM-DD') ?? null,
        reviewDate: values.reviewDate?.format('YYYY-MM-DD') ?? null,
        responsible: values.responsible?.trim() || '',
        ...(fileInfo && {
          fileName: fileInfo.originalName,
          fileUrl: fileInfo.fileUrl,
          fileSize: fileInfo.fileSize,
        }),
      };

      console.log('📤 Enviando documento:', payload);

      if (docData) {
        await updateDocument({ id: docData.id, data: payload });
        message.success('Documento actualizado exitosamente');
      } else {
        await createDocument(payload);
        message.success('Documento creado exitosamente');
      }

      handleClose();
    } catch (error) {
      console.error('Error al guardar:', error);
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

  // Validación de fechas cruzadas
  const validateReviewDate = (_, value) => {
    const approvalDate = form.getFieldValue('approvalDate');
    if (value && approvalDate && value.isBefore(approvalDate)) {
      return Promise.reject('La próxima revisión debe ser posterior a la fecha de aprobación');
    }
    return Promise.resolve();
  };

  // Configuración del uploader
  const uploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      const isValidSize = file.size / 1024 / 1024 < 10;
      if (!isValidSize) {
        message.error('El archivo debe ser menor a 10MB');
        return false;
      }
      setFileList([file]);
      return false; // Previene upload automático
    },
    fileList,
    accept: '.pdf,.doc,.docx,.xls,.xlsx',
    maxCount: 1,
  };

  return (
    <Modal
      title={docData ? 'Editar Documento' : 'Nuevo Documento'}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Fila 1: Código y Versión */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="code"
            label="Código"
            rules={[
              { required: true, message: 'Ingrese el código' },
              {
                pattern: CODE_REGEX,
                message: 'Formato inválido. Use letras mayúsculas + guión + números (ej: DOC-001)',
              },
            ]}
            normalize={(val) => val?.toUpperCase()}
          >
            <Input placeholder="Ej: DOC-001" />
          </Form.Item>

          <Form.Item
            name="version"
            label="Versión"
            rules={[
              { required: true, message: 'Ingrese la versión' },
              { pattern: /^\d+\.\d+$/, message: 'Formato inválido (ej: 1.0)' },
            ]}
          >
            <Input placeholder="Ej: 1.0" disabled={!!docData} />
          </Form.Item>
        </div>

        {/* Título */}
        <Form.Item
          name="title"
          label="Título"
          rules={[
            { required: true, message: 'Ingrese el título' },
            { min: 5, message: 'El título debe tener al menos 5 caracteres' },
            { max: 200, message: 'El título no puede exceder 200 caracteres' },
          ]}
        >
          <Input placeholder="Título del documento" />
        </Form.Item>

        {/* Fila 2: Tipo y Estado */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="type"
            label="Tipo de Documento"
            rules={[{ required: true, message: 'Seleccione el tipo' }]}
          >
            <Select placeholder="Seleccionar tipo" options={DOCUMENT_TYPES} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Estado"
            rules={[{ required: true, message: 'Seleccione el estado' }]}
          >
            <Select placeholder="Seleccionar estado" options={DOCUMENT_STATUSES} />
          </Form.Item>
        </div>

        {/* Fila 3: Fechas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item name="approvalDate" label="Fecha de Aprobación">
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              onChange={() => form.validateFields(['reviewDate'])}
            />
          </Form.Item>

          <Form.Item
            name="reviewDate"
            label="Próxima Revisión"
            dependencies={['approvalDate']}
            rules={[{ validator: validateReviewDate }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
        </div>

        {/* Responsable */}
        <Form.Item
          name="responsible"
          label="Responsable"
          rules={[{ max: 100, message: 'Máximo 100 caracteres' }]}
        >
          <Input placeholder="Nombre del responsable" />
        </Form.Item>

        {/* Descripción */}
        <Form.Item
          name="description"
          label="Descripción"
          rules={[{ max: 500, message: 'Máximo 500 caracteres' }]}
        >
          <TextArea rows={3} placeholder="Descripción del documento" showCount maxLength={500} />
        </Form.Item>

        {/* Archivo adjunto */}
        <Form.Item label="Archivo (opcional)">
          <Dragger {...uploadProps} disabled={uploading}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              {uploading ? 'Subiendo archivo...' : 'Haga clic o arrastre el archivo aquí'}
            </p>
            <p className="ant-upload-hint">
              PDF, Word, Excel — máximo 10MB
            </p>
          </Dragger>
        </Form.Item>

        {/* Botones */}
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading || uploading}
            disabled={uploading}
          >
            {docData ? 'Actualizar' : 'Guardar'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DocumentForm;