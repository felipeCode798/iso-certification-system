import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Button, Space, Timeline, Spin, message, Table } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileWordOutlined, FileExcelOutlined } from '@ant-design/icons';
import apiClient from '../../../services/api/apiClient';

const DocumentViewer = ({ visible, onClose, document, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return <FilePdfOutlined className="text-red-500 text-2xl" />;
      case 'doc':
      case 'docx': return <FileWordOutlined className="text-blue-500 text-2xl" />;
      case 'xls':
      case 'xlsx': return <FileExcelOutlined className="text-green-500 text-2xl" />;
      default: return <FilePdfOutlined className="text-gray-500 text-2xl" />;
    }
  };

  const loadVersions = async () => {
    if (!document?.id) return;
    setLoadingVersions(true);
    try {
      const response = await apiClient.get(`/documents/${document.id}/versions`);
      console.log('📦 DocumentViewer - Respuesta:', response);
      
      let versionsData = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        versionsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        versionsData = response.data;
      } else {
        versionsData = [];
      }
      
      console.log('📦 DocumentViewer - Versiones:', versionsData);
      setVersions(versionsData);
    } catch (error) {
      console.error('Error cargando versiones:', error);
    } finally {
      setLoadingVersions(false);
    }
  };

  React.useEffect(() => {
    if (visible && document?.id) {
      loadVersions();
    }
  }, [visible, document?.id]);

  const handleDownload = async () => {
    if (!document?.fileUrl) {
      message.warning('Este documento no tiene archivo adjunto');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}${document.fileUrl}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = document.fileName || `documento_${document.code}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        message.success('Descarga iniciada');
      } else {
        message.error('No se pudo descargar el archivo');
      }
    } catch (error) {
      console.error('Error en descarga:', error);
      message.error('Error al descargar el archivo');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreVersion = async (version) => {
    Modal.confirm({
      title: '¿Restaurar versión?',
      content: `Se restaurará la versión ${version.version}. La versión actual se guardará como historial.`,
      onOk: async () => {
        try {
          await apiClient.post(`/documents/${document.id}/restore/${version.id}`);
          message.success('Versión restaurada exitosamente');
          loadVersions();
          if (onRefresh) onRefresh();
        } catch (error) {
          message.error('Error al restaurar versión');
        }
      },
    });
  };

  const versionColumns = [
    { title: 'Versión', dataIndex: 'version', key: 'version', width: 80, render: (v) => <Tag color="blue">v{v}</Tag> },
    { title: 'Fecha', dataIndex: 'date', key: 'date', width: 110 },
    { title: 'Autor', dataIndex: 'author', key: 'author', width: 120 },
    { title: 'Cambios', dataIndex: 'changes', key: 'changes', ellipsis: true },
    {
      title: 'Acciones', key: 'actions', width: 100,
      render: (_, record) => (
        <Button size="small" icon={<DownloadOutlined />} onClick={() => handleRestoreVersion(record)}>
          Restaurar
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={`Documento: ${document?.code} - ${document?.title}`}
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownload} loading={loading}>
          Descargar
        </Button>,
        <Button key="close" onClick={onClose}>Cerrar</Button>,
      ]}
    >
      <Spin spinning={loadingVersions}>
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            {getFileIcon(document?.fileName)}
            <div>
              <h3 className="text-lg font-semibold">{document?.title}</h3>
              <p className="text-gray-500">{document?.code} - v{document?.version}</p>
            </div>
          </div>

          <Descriptions bordered column={2} size="small" className="mb-4">
            <Descriptions.Item label="Estado">
              <Tag color={document?.status === 'aprobado' ? 'green' : 'orange'}>
                {document?.status?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tipo">{document?.type?.toUpperCase()}</Descriptions.Item>
            <Descriptions.Item label="Fecha Aprobación">{document?.approvalDate || 'Pendiente'}</Descriptions.Item>
            <Descriptions.Item label="Próxima Revisión">{document?.reviewDate || 'No definida'}</Descriptions.Item>
            <Descriptions.Item label="Responsable">{document?.responsible || 'No asignado'}</Descriptions.Item>
            <Descriptions.Item label="Descripción" span={2}>{document?.description || 'Sin descripción'}</Descriptions.Item>
          </Descriptions>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Historial de Versiones</h4>
            {versions.length > 0 ? (
              <Table
                columns={versionColumns}
                dataSource={versions}
                rowKey="id"
                size="small"
                pagination={false}
                scroll={{ y: 300 }}
              />
            ) : (
              <div className="text-center py-4 text-gray-500">No hay versiones anteriores</div>
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default DocumentViewer;