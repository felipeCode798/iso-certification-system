// src/components/modules/documentation/VersionControl.jsx
import React, { useState } from 'react';
import { Table, Tag, Button, Space, Modal, Timeline, Badge, Select, DatePicker, Descriptions } from 'antd';
import { HistoryOutlined, RollbackOutlined, EyeOutlined, DiffOutlined as CompareOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const VersionControl = () => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [compareModal, setCompareModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const versionsData = [
    {
      id: 1,
      documentCode: 'DOC-001',
      documentTitle: 'Procedimiento de Calidad',
      version: '2.0',
      status: 'active',
      date: '2024-01-15',
      author: 'Admin',
      changes: 'Actualización completa del procedimiento',
      size: '245 KB',
    },
    {
      id: 2,
      documentCode: 'DOC-001',
      documentTitle: 'Procedimiento de Calidad',
      version: '1.5',
      status: 'archived',
      date: '2023-12-10',
      author: 'Manager',
      changes: 'Corrección de errores menores',
      size: '230 KB',
    },
  ];

  const columns = [
    {
      title: 'Documento',
      dataIndex: 'documentTitle',
      key: 'documentTitle',
      render: (text, record) => (
        <div>
          <div className="font-semibold">{text}</div>
          <div className="text-xs text-gray-500">{record.documentCode}</div>
        </div>
      ),
    },
    {
      title: 'Versión',
      dataIndex: 'version',
      key: 'version',
      render: (version) => <Tag color="blue">v{version}</Tag>,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge status={status === 'active' ? 'success' : 'default'} text={status === 'active' ? 'Activa' : 'Archivada'} />
      ),
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Autor',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Cambios',
      dataIndex: 'changes',
      key: 'changes',
      ellipsis: true,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => setSelectedVersion(record)}>
            Ver
          </Button>
          <Button icon={<RollbackOutlined />} size="small">
            Restaurar
          </Button>
          <Button icon={<CompareOutlined />} size="small" onClick={() => setCompareModal(true)}>
            Comparar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="version-control">
      <div className="flex justify-between mb-4">
        <Space>
          <Select placeholder="Seleccionar documento" style={{ width: 250 }}>
            <Select.Option value="DOC-001">DOC-001 - Procedimiento Calidad</Select.Option>
            <Select.Option value="DOC-002">DOC-002 - Instructivo Auditoría</Select.Option>
          </Select>
          <DatePicker placeholder="Fecha desde" />
          <DatePicker placeholder="Fecha hasta" />
        </Space>
        <Button icon={<HistoryOutlined />}>Historial Completo</Button>
      </div>

      <Table columns={columns} dataSource={versionsData} rowKey="id" />

      <Modal
        title="Detalles de Versión"
        open={!!selectedVersion}
        onCancel={() => setSelectedVersion(null)}
        footer={null}
        width={600}
      >
        {selectedVersion && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Documento">{selectedVersion.documentTitle}</Descriptions.Item>
              <Descriptions.Item label="Código">{selectedVersion.documentCode}</Descriptions.Item>
              <Descriptions.Item label="Versión">{selectedVersion.version}</Descriptions.Item>
              <Descriptions.Item label="Fecha">{selectedVersion.date}</Descriptions.Item>
              <Descriptions.Item label="Autor">{selectedVersion.author}</Descriptions.Item>
              <Descriptions.Item label="Tamaño">{selectedVersion.size}</Descriptions.Item>
              <Descriptions.Item label="Cambios Realizados">{selectedVersion.changes}</Descriptions.Item>
            </Descriptions>
            <div className="mt-4">
              <Button type="primary" block>Descargar esta versión</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Comparar Versiones"
        open={compareModal}
        onCancel={() => setCompareModal(false)}
        width={900}
        footer={null}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Versión 1.5</h4>
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-sm">Contenido de la versión anterior...</pre>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Versión 2.0</h4>
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-sm">Contenido de la nueva versión...</pre>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Tag color="green">+ Líneas agregadas</Tag>
          <Tag color="red">- Líneas eliminadas</Tag>
          <Tag color="yellow">~ Líneas modificadas</Tag>
        </div>
      </Modal>
    </div>
  );
};

export default VersionControl;