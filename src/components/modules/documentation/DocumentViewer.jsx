// src/components/modules/documentation/DocumentViewer.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Button, Space, Spin, message, Table, Badge } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileWordOutlined, FileExcelOutlined } from '@ant-design/icons';
import apiClient from '../../../services/api/apiClient';

// CORRECCIÓN #7: prop renombrado a `docData` en toda la cadena de componentes
// para evitar colisión con la variable global `window.document` del DOM.

const getFileIcon = (fileName) => {
  const ext = fileName?.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <FilePdfOutlined className="text-red-500 text-2xl" />;
  if (ext === 'doc' || ext === 'docx') return <FileWordOutlined className="text-blue-500 text-2xl" />;
  if (ext === 'xls' || ext === 'xlsx') return <FileExcelOutlined className="text-green-500 text-2xl" />;
  return <FilePdfOutlined className="text-gray-500 text-2xl" />;
};

const statusColorMap = {
  aprobado: 'green',
  revision: 'orange',
  borrador: 'default',
  obsoleto: 'red',
};

const DocumentViewer = ({ visible, onClose, document: docData, onRefresh }) => {
  const [downloading, setDownloading] = useState(false);
  const [versions, setVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [restoringId, setRestoringId] = useState(null); // CORRECCIÓN #10: feedback al restaurar

  const loadVersions = async () => {
    if (!docData?.id) return;
    setLoadingVersions(true);
    try {
      const response = await apiClient.get(`/documents/${docData.id}/versions`);
      const data = response.data?.data ?? response.data;
      setVersions(Array.isArray(data) ? data : []);
    } catch {
      // Silencioso — no crítico para la vista principal
    } finally {
      setLoadingVersions(false);
    }
  };

  useEffect(() => {
    if (visible && docData?.id) {
      loadVersions();
    } else {
      setVersions([]);
    }
  }, [visible, docData?.id]);

  const handleDownload = async () => {
    if (!docData?.fileUrl) {
      message.warning('Este documento no tiene archivo adjunto');
      return;
    }

    setDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${baseUrl}${docData.fileUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Respuesta no OK');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // CORRECCIÓN #7 y #9: usar window.document explícitamente para manipular el DOM
      const anchor = window.document.createElement('a');
      anchor.href = url;
      anchor.download = docData.fileName || `documento_${docData.code}.pdf`;
      window.document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(anchor);

      message.success('Descarga iniciada');
    } catch {
      message.error('Error al descargar el archivo');
    } finally {
      setDownloading(false);
    }
  };

  const handleRestoreVersion = (version) => {
    Modal.confirm({
      title: '¿Restaurar versión?',
      content: `Se restaurará la versión ${version.version}. La versión actual quedará en el historial.`,
      okText: 'Restaurar',
      cancelText: 'Cancelar',
      onOk: async () => {
        setRestoringId(version.id); // CORRECCIÓN #10
        try {
          await apiClient.post(`/documents/${docData.id}/restore/${version.id}`);
          message.success('Versión restaurada exitosamente');
          loadVersions();
          onRefresh?.();
        } catch {
          message.error('Error al restaurar versión');
        } finally {
          setRestoringId(null);
        }
      },
    });
  };

  const versionColumns = [
    {
      title: 'Versión',
      dataIndex: 'version',
      key: 'version',
      width: 80,
      render: (v) => <Tag color="blue">v{v}</Tag>,
    },
    { title: 'Fecha', dataIndex: 'date', key: 'date', width: 110 },
    { title: 'Autor', dataIndex: 'author', key: 'author', width: 130 },
    { title: 'Cambios', dataIndex: 'changes', key: 'changes', ellipsis: true },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s) => (
        <Badge
          status={s === 'active' ? 'success' : 'default'}
          text={s === 'active' ? 'Activa' : 'Archivada'}
        />
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 110,
      render: (_, record) => (
        <Button
          size="small"
          icon={<DownloadOutlined />}
          loading={restoringId === record.id}
          onClick={() => handleRestoreVersion(record)}
        >
          Restaurar
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={`${docData?.code} — ${docData?.title}`}
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          loading={downloading}
          disabled={!docData?.fileUrl}
        >
          Descargar
        </Button>,
        <Button key="close" onClick={onClose}>
          Cerrar
        </Button>,
      ]}
    >
      <div className="flex items-center gap-4 mb-4">
        {getFileIcon(docData?.fileName)}
        <div>
          <h3 className="text-lg font-semibold m-0">{docData?.title}</h3>
          <p className="text-gray-500 m-0">
            {docData?.code} — v{docData?.version}
          </p>
        </div>
      </div>

      <Descriptions bordered column={2} size="small" className="mb-4">
        <Descriptions.Item label="Estado">
          <Tag color={statusColorMap[docData?.status] || 'default'}>
            {docData?.status?.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tipo">{docData?.type?.toUpperCase()}</Descriptions.Item>
        <Descriptions.Item label="Fecha Aprobación">
          {docData?.approvalDate || 'Pendiente'}
        </Descriptions.Item>
        <Descriptions.Item label="Próxima Revisión">
          {docData?.reviewDate || 'No definida'}
        </Descriptions.Item>
        <Descriptions.Item label="Responsable">
          {docData?.responsible || 'No asignado'}
        </Descriptions.Item>
        <Descriptions.Item label="Descripción" span={2}>
          {docData?.description || 'Sin descripción'}
        </Descriptions.Item>
      </Descriptions>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Historial de Versiones</h4>
        <Spin spinning={loadingVersions}>
          {versions.length > 0 ? (
            <Table
              columns={versionColumns}
              dataSource={versions}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ y: 260 }}
            />
          ) : (
            !loadingVersions && (
              <div className="text-center py-4 text-gray-400">
                No hay versiones anteriores registradas
              </div>
            )
          )}
        </Spin>
      </div>
    </Modal>
  );
};

export default DocumentViewer;