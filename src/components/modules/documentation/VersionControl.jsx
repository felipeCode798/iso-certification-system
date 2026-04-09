import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Modal, Badge, Select, DatePicker, Descriptions, message, Spin } from 'antd';
import { HistoryOutlined, RollbackOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useGetDocumentsQuery } from '../../../services/api/documentationService';
import apiClient from '../../../services/api/apiClient';
import dayjs from 'dayjs';

const VersionControl = () => {
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const { data: documents = [], refetch: refetchDocuments } = useGetDocumentsQuery();

  const documentOptions = Array.isArray(documents) 
    ? documents.map(doc => ({ value: doc.id, label: `${doc.code} - ${doc.title}` }))
    : [];

  const loadVersions = async (documentId) => {
    if (!documentId) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/documents/${documentId}/versions`);
      console.log('📦 Respuesta completa del API:', response);
      console.log('📦 response.data:', response.data);
      
      // Intentar diferentes formas de extraer los datos
      let versionsData = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        versionsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        versionsData = response.data;
      } else if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        versionsData = response.data.data.data;
      } else {
        versionsData = [];
      }
      
      console.log('📦 Versiones extraídas:', versionsData);
      setVersions(versionsData);
      
      if (versionsData.length === 0) {
        message.info('No hay versiones para este documento');
      }
    } catch (error) {
      console.error('❌ Error detallado:', error);
      message.error('Error al cargar versiones: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDocumentId) {
      loadVersions(selectedDocumentId);
    }
  }, [selectedDocumentId]);

  const handleRestore = async (version) => {
    Modal.confirm({
      title: '¿Restaurar versión?',
      content: `Se restaurará la versión ${version.version}. La versión actual se guardará como historial.`,
      onOk: async () => {
        try {
          await apiClient.post(`/documents/${selectedDocumentId}/restore/${version.id}`);
          message.success('Versión restaurada exitosamente');
          loadVersions(selectedDocumentId);
          refetchDocuments();
        } catch (error) {
          console.error('Error al restaurar:', error);
          message.error('Error al restaurar versión: ' + (error.response?.data?.message || error.message));
        }
      },
    });
  };

  const columns = [
    {
      title: 'Versión',
      dataIndex: 'version',
      key: 'version',
      width: 100,
      render: (version) => <Tag color="blue">v{version}</Tag>,
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Autor',
      dataIndex: 'author',
      key: 'author',
      width: 150,
    },
    {
      title: 'Cambios',
      dataIndex: 'changes',
      key: 'changes',
      ellipsis: true,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge status={status === 'active' ? 'success' : 'default'} text={status === 'active' ? 'Activa' : 'Archivada'} />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => setSelectedVersion(record)}>
            Ver
          </Button>
          <Button icon={<RollbackOutlined />} size="small" onClick={() => handleRestore(record)}>
            Restaurar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="version-control">
      <div className="flex justify-between mb-4">
        <Space>
          <Select
            placeholder="Seleccionar documento"
            style={{ width: 300 }}
            options={documentOptions}
            onChange={setSelectedDocumentId}
            allowClear
            showSearch
            filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
          />
          <Button icon={<ReloadOutlined />} onClick={() => selectedDocumentId && loadVersions(selectedDocumentId)}>
            Recargar
          </Button>
        </Space>
        <Button icon={<HistoryOutlined />}>Historial Completo</Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={versions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: selectedDocumentId ? 'No hay versiones' : 'Seleccione un documento' }}
        />
      </Spin>

      <Modal
        title="Detalles de Versión"
        open={!!selectedVersion}
        onCancel={() => setSelectedVersion(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedVersion(null)}>Cerrar</Button>,
          selectedVersion?.fileUrl && (
            <Button key="download" type="primary" href={selectedVersion.fileUrl} target="_blank">
              Descargar
            </Button>
          ),
        ]}
        width={600}
      >
        {selectedVersion && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Versión">{selectedVersion.version}</Descriptions.Item>
            <Descriptions.Item label="Fecha">{selectedVersion.date}</Descriptions.Item>
            <Descriptions.Item label="Autor">{selectedVersion.author}</Descriptions.Item>
            <Descriptions.Item label="Cambios">{selectedVersion.changes || 'No especificado'}</Descriptions.Item>
            <Descriptions.Item label="Estado">
              <Badge status={selectedVersion.status === 'active' ? 'success' : 'default'} text={selectedVersion.status === 'active' ? 'Activa' : 'Archivada'} />
            </Descriptions.Item>
            {selectedVersion.fileName && (
              <Descriptions.Item label="Archivo">{selectedVersion.fileName}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default VersionControl;