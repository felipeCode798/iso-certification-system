// src/components/modules/documentation/DocumentViewer.jsx
import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Button, Space, Timeline, Spin, Image, message } from 'antd';
import { DownloadOutlined, EyeOutlined, HistoryOutlined, FilePdfOutlined, FileWordOutlined, FileExcelOutlined } from '@ant-design/icons';

const DocumentViewer = ({ visible, onClose, document }) => {
  const [loading, setLoading] = useState(false);

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

  const handleDownload = async () => {
    setLoading(true);
    // Simular descarga
    setTimeout(() => {
      setLoading(false);
      message.success('Descarga iniciada');
    }, 1000);
  };

  const versionHistory = [
    { version: 'v1.0', date: '2024-01-01', changes: 'Versión inicial', author: 'Admin' },
    { version: 'v1.1', date: '2024-01-15', changes: 'Actualización de procesos', author: 'Manager' },
  ];

  return (
    <Modal
      title={`Documento: ${document?.code} - ${document?.title}`}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownload} loading={loading}>
          Descargar
        </Button>,
        <Button key="close" onClick={onClose}>
          Cerrar
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            {getFileIcon(document?.fileName)}
            <div>
              <h3 className="text-lg font-semibold">{document?.title}</h3>
              <p className="text-gray-500">{document?.code}</p>
            </div>
          </div>

          <Descriptions bordered column={2} className="mb-4">
            <Descriptions.Item label="Versión">
              <Tag color="blue">v{document?.version}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              <Tag color={document?.status === 'aprobado' ? 'green' : 'orange'}>
                {document?.status?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tipo">{document?.type?.toUpperCase()}</Descriptions.Item>
            <Descriptions.Item label="Fecha Aprobación">{document?.approvalDate}</Descriptions.Item>
            <Descriptions.Item label="Próxima Revisión">{document?.reviewDate}</Descriptions.Item>
            <Descriptions.Item label="Responsable">{document?.responsible}</Descriptions.Item>
            <Descriptions.Item label="Descripción" span={2}>{document?.description}</Descriptions.Item>
          </Descriptions>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Historial de Versiones</h4>
            <Timeline>
              {versionHistory.map((version, index) => (
                <Timeline.Item key={index}>
                  <div className="flex justify-between">
                    <span className="font-medium">{version.version}</span>
                    <span className="text-gray-500">{version.date}</span>
                  </div>
                  <p className="text-sm">{version.changes}</p>
                  <span className="text-xs text-gray-400">Autor: {version.author}</span>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default DocumentViewer;