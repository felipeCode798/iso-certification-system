// src/components/modules/documentation/VersionControl.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Table, Tag, Button, Space, Modal, Badge,
  Select, Descriptions, message, Spin, Alert,
} from 'antd';
import { 
  HistoryOutlined, RollbackOutlined, EyeOutlined, 
  ReloadOutlined, DownloadOutlined, FileExcelOutlined 
} from '@ant-design/icons';
import { useGetDocumentsQuery } from '../../../services/api/documentationService';
import apiClient from '../../../services/api/apiClient';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const VersionControl = ({ onNavigateToDocuments }) => {
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [exporting, setExporting] = useState(false);

  const { data: documentsData, refetch: refetchDocuments } = useGetDocumentsQuery();

  const documents = useMemo(() => {
    if (Array.isArray(documentsData)) return documentsData;
    if (documentsData?.data && Array.isArray(documentsData.data)) return documentsData.data;
    return [];
  }, [documentsData]);

  const loadVersions = async (documentId) => {
    if (!documentId) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/documents/${documentId}/versions`);
      const data = response.data?.data ?? response.data;
      const versionsData = Array.isArray(data) ? data : [];
      setVersions(versionsData);

      if (versionsData.length === 0) {
        message.info('Este documento no tiene versiones históricas registradas');
      }
    } catch {
      message.error('Error al cargar versiones');
      setVersions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDocumentId) {
      loadVersions(selectedDocumentId);
    } else {
      setVersions([]);
    }
  }, [selectedDocumentId]);

  const handleRestore = (version) => {
    Modal.confirm({
      title: '¿Restaurar esta versión?',
      content: `Se restaurará la versión ${version.version}. La versión actual se archivará en el historial.`,
      okText: 'Restaurar',
      cancelText: 'Cancelar',
      onOk: async () => {
        setRestoringId(version.id);
        try {
          await apiClient.post(`/documents/${selectedDocumentId}/restore/${version.id}`);
          message.success('Versión restaurada exitosamente');
          await loadVersions(selectedDocumentId);
          refetchDocuments();
        } catch {
          message.error('Error al restaurar la versión');
        } finally {
          setRestoringId(null);
        }
      },
    });
  };

  // Exportar historial completo a Excel
  const handleExportHistory = () => {
    if (versions.length === 0) {
      message.warning('No hay versiones para exportar');
      return;
    }

    setExporting(true);
    try {
      const selectedDoc = documents.find(doc => doc.id === selectedDocumentId);
      
      const exportData = versions.map((version, index) => ({
        '#': index + 1,
        'Versión': version.version,
        'Fecha': version.date,
        'Autor': version.author,
        'Cambios Realizados': version.changes || 'No especificado',
        'Estado': version.status === 'active' ? 'Activa' : 'Archivada',
        'Documento': selectedDoc ? `${selectedDoc.code} - ${selectedDoc.title}` : 'N/A',
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      const fileName = selectedDoc 
        ? `historial_${selectedDoc.code}_${dayjs().format('YYYY-MM-DD')}.xlsx`
        : `historial_versiones_${dayjs().format('YYYY-MM-DD')}.xlsx`;
      
      XLSX.utils.book_append_sheet(wb, ws, 'Historial de Versiones');
      XLSX.writeFile(wb, fileName);
      
      message.success(`Historial exportado: ${fileName}`);
    } catch (error) {
      console.error('Error al exportar:', error);
      message.error('Error al exportar el historial');
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    {
      title: 'Versión',
      dataIndex: 'version',
      key: 'version',
      width: 90,
      render: (v) => <Tag color="blue">v{v}</Tag>,
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
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
      width: 110,
      render: (status) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={status === 'active' ? 'Activa' : 'Archivada'}
        />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => setSelectedVersion(record)}
          >
            Ver
          </Button>
          <Button
            icon={<RollbackOutlined />}
            size="small"
            loading={restoringId === record.id}
            disabled={record.status === 'active'}
            onClick={() => handleRestore(record)}
          >
            Restaurar
          </Button>
        </Space>
      ),
    },
  ];

  if (documents.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="No hay documentos disponibles"
          description="Primero cree documentos en la pestaña 'Documentos' para poder consultar su historial de versiones."
          type="info"
          showIcon
        />
        {onNavigateToDocuments && (
          <Button type="primary" style={{ marginTop: 16 }} onClick={onNavigateToDocuments}>
            Ir a Documentos
          </Button>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <Space wrap>
          <span style={{ fontWeight: 600 }}>Documento:</span>
          <Select
            placeholder="Seleccione un documento"
            style={{ width: 360 }}
            onChange={setSelectedDocumentId}
            allowClear
            showSearch
            value={selectedDocumentId}
            options={documents.map((doc) => ({
              value: doc.id,
              label: `${doc.code} — ${doc.title} (v${doc.version})`,
            }))}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          />
          <Button
            icon={<ReloadOutlined />}
            disabled={!selectedDocumentId}
            onClick={() => loadVersions(selectedDocumentId)}
          >
            Recargar
          </Button>
        </Space>
        <Button
          icon={<FileExcelOutlined />}
          disabled={versions.length === 0}
          onClick={handleExportHistory}
          loading={exporting}
          type="primary"
          ghost
        >
          Exportar historial
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={versions}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (t) => `Total: ${t} versiones` }}
          locale={{
            emptyText: selectedDocumentId
              ? 'No hay versiones registradas para este documento'
              : 'Seleccione un documento para ver su historial',
          }}
          scroll={{ x: 800 }}
        />
      </Spin>

      <Modal
        title={`Detalle — Versión ${selectedVersion?.version}`}
        open={!!selectedVersion}
        onCancel={() => setSelectedVersion(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedVersion(null)}>
            Cerrar
          </Button>,
        ]}
        width={560}
      >
        {selectedVersion && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Versión">
              <Tag color="blue">v{selectedVersion.version}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Fecha">{selectedVersion.date}</Descriptions.Item>
            <Descriptions.Item label="Autor">{selectedVersion.author || '—'}</Descriptions.Item>
            <Descriptions.Item label="Cambios">
              {selectedVersion.changes || 'No especificado'}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              <Badge
                status={selectedVersion.status === 'active' ? 'success' : 'default'}
                text={selectedVersion.status === 'active' ? 'Activa' : 'Archivada'}
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default VersionControl;