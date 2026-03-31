import React, { useState } from 'react';
import { Table, Button, Space, Tag, Input, Modal, message, Tooltip } from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, SearchOutlined, ReloadOutlined
} from '@ant-design/icons';
import DocumentForm from './DocumentForm';
import DocumentViewer from './DocumentViewer';
import { useGetDocumentsQuery, useDeleteDocumentMutation } from '../../../services/api/documentationService';

const statusColors = {
  aprobado: 'success',
  revision: 'warning',
  borrador: 'default',
  obsoleto: 'error',
};

const typeColors = {
  manual: 'blue',
  procedure: 'geekblue',
  instruction: 'cyan',
  format: 'purple',
  policy: 'magenta',
};

const DocumentList = () => {
  const [searchText, setSearchText] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const { data: documents = [], isLoading, refetch } = useGetDocumentsQuery();
  const { mutateAsync: deleteDocument } = useDeleteDocumentMutation(); // ✅ objeto

  const handleDelete = (record) => {
    Modal.confirm({
      title: '¿Eliminar documento?',
      content: `Se eliminará "${record.title}" permanentemente.`,
      okText: 'Eliminar',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: async () => {
        await deleteDocument(record.id);
        message.success('Documento eliminado');
      },
    });
  };

  const columns = [
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
      width: 110,
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => (
        <Tag color={typeColors[type] || 'default'}>{type?.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Manual', value: 'manual' },
        { text: 'Procedimiento', value: 'procedure' },
        { text: 'Instructivo', value: 'instruction' },
        { text: 'Formato', value: 'format' },
        { text: 'Política', value: 'policy' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Versión',
      dataIndex: 'version',
      key: 'version',
      width: 90,
      render: (version) => <Tag color="blue">v{version}</Tag>,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={statusColors[status] || 'default'}>{status?.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Aprobado', value: 'aprobado' },
        { text: 'En Revisión', value: 'revision' },
        { text: 'Borrador', value: 'borrador' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'F. Aprobación',
      dataIndex: 'approvalDate',
      key: 'approvalDate',
      width: 130,
      sorter: (a, b) => new Date(a.approvalDate) - new Date(b.approvalDate),
    },
    {
      title: 'Responsable',
      dataIndex: 'responsible',
      key: 'responsible',
      width: 120,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => { setSelectedDocument(record); setIsViewerVisible(true); }}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              ghost
              onClick={() => { setSelectedDocument(record); setIsFormVisible(true); }}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredDocuments = (documents || []).filter(doc =>
    doc.title?.toLowerCase().includes(searchText.toLowerCase()) ||
    doc.code?.toLowerCase().includes(searchText.toLowerCase()) ||
    doc.responsible?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="document-list">
      <div className="flex justify-between items-center mb-4">
        <Space>
          <Input
            placeholder="Buscar por código, título o responsable..."
            prefix={<SearchOutlined />}
            className="w-72"
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
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total: ${total} documentos` }}
        size="middle"
      />

      <DocumentForm
        visible={isFormVisible}
        onClose={() => { setIsFormVisible(false); setSelectedDocument(null); }}
        document={selectedDocument}
      />

      <DocumentViewer
        visible={isViewerVisible}
        onClose={() => { setIsViewerVisible(false); setSelectedDocument(null); }}
        document={selectedDocument}
      />
    </div>
  );
};

export default DocumentList;