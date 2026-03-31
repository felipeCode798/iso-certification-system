// src/components/modules/nonconformities/NCFollowUp.jsx
import React, { useState } from 'react';
import { Card, Table, Tag, Button, Timeline, Progress, Modal, Form, Input, Space, DatePicker, Select } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, MessageOutlined } from '@ant-design/icons';

const NCFollowUp = () => {
  const [selectedNC, setSelectedNC] = useState(null);
  const [commentModal, setCommentModal] = useState(false);

  const columns = [
    {
      title: 'ID NC',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Acción Correctiva',
      dataIndex: 'correctiveAction',
      key: 'correctiveAction',
    },
    {
      title: 'Progreso',
      key: 'progress',
      render: (_, record) => <Progress percent={record.progress} size="small" />,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'blue'}>
          {status === 'completed' ? 'Completada' : 'En Progreso'}
        </Tag>
      ),
    },
    {
      title: 'Verificación',
      key: 'verification',
      render: (_, record) => (
        <Button size="small" icon={<CheckCircleOutlined />} onClick={() => setSelectedNC(record)}>
          Verificar
        </Button>
      ),
    },
  ];

  const followUpData = [
    {
      id: 'NC-001',
      description: 'Falta de documentación en proceso',
      correctiveAction: 'Actualizar procedimiento',
      progress: 75,
      status: 'inProgress',
      timeline: [
        { action: 'Análisis completado', date: '2024-01-10', status: 'done' },
        { action: 'Acción definida', date: '2024-01-15', status: 'done' },
        { action: 'Implementación', date: '2024-01-20', status: 'inProgress' },
        { action: 'Verificación', date: '2024-01-25', status: 'pending' },
      ],
    },
  ];

  const handleVerify = (values) => {
    console.log('Verificación:', values);
    setSelectedNC(null);
  };

  return (
    <Card title="Seguimiento de No Conformidades">
      <Table columns={columns} dataSource={followUpData} rowKey="id" />

      <Modal
        title={`Verificación de Eficacia - ${selectedNC?.id}`}
        open={!!selectedNC}
        onCancel={() => setSelectedNC(null)}
        width={700}
        footer={null}
      >
        <Timeline className="mb-6">
          {selectedNC?.timeline.map((item, idx) => (
            <Timeline.Item key={idx} color={item.status === 'done' ? 'green' : item.status === 'inProgress' ? 'blue' : 'gray'}>
              <div className="font-semibold">{item.action}</div>
              <div className="text-sm text-gray-500">{item.date}</div>
            </Timeline.Item>
          ))}
        </Timeline>

        <Form layout="vertical" onFinish={handleVerify}>
          <Form.Item
            name="effectiveness"
            label="¿La acción fue efectiva?"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="yes">Sí, la no conformidad no se repitió</Select.Option>
              <Select.Option value="partial">Parcialmente, requiere mejora adicional</Select.Option>
              <Select.Option value="no">No, requiere nueva acción</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="evidence"
            label="Evidencias de verificación"
          >
            <Input placeholder="Adjuntar evidencias o comentarios" />
          </Form.Item>

          <Form.Item
            name="verifier"
            label="Verificado por"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nombre del verificador" />
          </Form.Item>

          <Form.Item
            name="verificationDate"
            label="Fecha de Verificación"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Cerrar No Conformidad
              </Button>
              <Button onClick={() => setSelectedNC(null)}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default NCFollowUp;