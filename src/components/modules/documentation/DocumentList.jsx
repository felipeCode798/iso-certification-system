// src/components/modules/documentation/DocumentList.jsx
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Input, Modal, message, Tooltip } from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, SearchOutlined, ReloadOutlined,
} from '@ant-design/icons';
import DocumentForm from './DocumentForm';
import DocumentViewer from './DocumentViewer';
import { useGetDocumentsQuery, useDeleteDocumentMutation } from '../../../services/api/documentationService';

const STATUS_COLORS = {
  aprobado: 'success',
  revision: 'warning',
  borrador: 'default',
  obsoleto: 'error',
};

const TYPE_COLORS = {
  manual: 'blue',
  procedure: 'geekblue',
  instruction: 'cyan',
  format: 'purple',
  policy: 'magenta',
};

const TYPE_LABELS = {
  manual: 'Manual',
  procedure: 'Procedimiento',
  instruction: 'Instructivo',
  format: 'Formato',
  policy: 'Política',
};

const STATUS_LABELS = {
  aprobado: 'Aprobado',
  revision: 'En Revisión',
  borrador: 'Borrador',
  obsoleto: 'Obsoleto',
};

const DocumentList = () => {
  const [searchText, setSearchText] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const { data: response, isLoading, refetch } = useGetDocumentsQuery();
  const { mutateAsync: deleteDocument } = useDeleteDocumentMutation();

  const documents = React.useMemo(() => {
    const raw = response?.data ?? response;
    return Array.isArray(raw) ? raw : [];
  }, [response]);

  const handleDelete = (record) => {
    Modal.confirm({
      title: '¿Eliminar documento?',
      content: `Se eliminará "${record.title}" permanentemente. Esta acción no se puede deshacer.`,
      okText: 'Eliminar',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await deleteDocument(record.id);
          message.success('Documento eliminado');
          refetch();
        } catch {
          message.error('Error al eliminar el documento');
        }
      },
    });
  };

  const openEdit = (record) => {
    setSelectedDocument(record);
    setIsFormVisible(true);
  };

  const openView = (record) => {
    setSelectedDocument(record);
    setIsViewerVisible(true);
  };

  const columns = [
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
      width: 110,
      sorter: (a, b) => a.code?.localeCompare(b.code),
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title?.localeCompare(b.title),
      ellipsis: true,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type) => (
        <Tag color={TYPE_COLORS[type] || 'default'}>
          {TYPE_LABELS[type] || type?.toUpperCase()}
        </Tag>
      ),
      filters: Object.entries(TYPE_LABELS).map(([value, text]) => ({ text, value })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Versión',
      dataIndex: 'version',
      key: 'version',
      width: 85,
      render: (v) => <Tag color="blue">v{v}</Tag>,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || 'default'}>
          {STATUS_LABELS[status] || status?.toUpperCase()}
        </Tag>
      ),
      filters: Object.entries(STATUS_LABELS).map(([value, text]) => ({ text, value })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'F. Aprobación',
      dataIndex: 'approvalDate',
      key: 'approvalDate',
      width: 130,
      sorter: (a, b) => new Date(a.approvalDate || 0) - new Date(b.approvalDate || 0),
      render: (date) => date || '—',
    },
    {
      title: 'Responsable',
      dataIndex: 'responsible',
      key: 'responsible',
      width: 130,
      ellipsis: true,
      render: (v) => v || '—',
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver detalle">
            <Button icon={<EyeOutlined />} size="small" onClick={() => openView(record)} />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              ghost
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.code?.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.responsible?.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="document-list">
      <div className="flex justify-between items-center mb-4">
        <Space>
          <Input
            placeholder="Buscar por código, título o responsable..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Tooltip title="Recargar">
            <Button icon={<ReloadOutlined />} onClick={() => refetch()} />
          </Tooltip>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => { setSelectedDocument(null); setIsFormVisible(true); }}
        >
          Nuevo Documento
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredDocuments}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} documentos`,
        }}
        size="middle"
      />

      <DocumentForm
        visible={isFormVisible}
        onClose={() => { setIsFormVisible(false); refetch(); }}
        document={selectedDocument}
      />

      <DocumentViewer
        visible={isViewerVisible}
        onClose={() => { setIsViewerVisible(false); setSelectedDocument(null); }}
        document={selectedDocument}
        onRefresh={refetch}
      />
    </div>
  );
};

export default DocumentList;