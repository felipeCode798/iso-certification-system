// src/components/modules/nonconformities/NCFollowUp.jsx
import React, { useState } from 'react';
import { Card, Table, Tag, Button, Timeline, Progress, Modal, Form, Input, Space, DatePicker, Select, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const NCFollowUp = ({ ncs = [], onUpdate }) => {
  const [selectedNC, setSelectedNC] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'ID NC', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Descripción', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Acción Correctiva', dataIndex: 'correctiveAction', key: 'correctiveAction', ellipsis: true },
    { title: 'Responsable', dataIndex: 'responsible', key: 'responsible' },
    { title: 'Progreso', key: 'progress', width: 120, render: (_, record) => <Progress percent={record.progress || 0} size="small" /> },
    { title: 'Estado', dataIndex: 'status', key: 'status', width: 120, render: (status) => <Tag color={status === 'closed' ? 'green' : 'blue'}>{status === 'closed' ? 'Cerrada' : 'En Progreso'}</Tag> },
    { title: 'Verificación', key: 'verification', width: 100, render: (_, record) => (
      <Button size="small" icon={<CheckCircleOutlined />} onClick={() => { setSelectedNC(record); setModalVisible(true); }}>
        Verificar
      </Button>
    ) },
  ];

  const handleVerify = (values) => {
    const updatedNCs = ncs.map(nc => 
      nc.id === selectedNC?.id 
        ? { ...nc, status: 'closed', progress: 100, closure: values, closureDate: dayjs().format('YYYY-MM-DD') }
        : nc
    );
    onUpdate(updatedNCs);
    message.success('No conformidad cerrada exitosamente');
    setModalVisible(false);
    setSelectedNC(null);
    form.resetFields();
  };

  return (
    <Card title="Seguimiento de No Conformidades">
      <Table columns={columns} dataSource={ncs.filter(nc => nc.status !== 'closed')} rowKey="id" />

      <Modal
        title={`Verificación de Eficacia - ${selectedNC?.id}`}
        open={modalVisible}
        onCancel={() => { setModalVisible(false); setSelectedNC(null); form.resetFields(); }}
        width={700}
        footer={null}
      >
        <Card size="small" className="mb-4">
          <p><strong>No Conformidad:</strong> {selectedNC?.description}</p>
          <p><strong>Acción Correctiva:</strong> {selectedNC?.correctiveAction || 'No definida'}</p>
          <p><strong>Responsable:</strong> {selectedNC?.responsible || 'No asignado'}</p>
        </Card>

        <Form form={form} layout="vertical" onFinish={handleVerify}>
          <Form.Item name="effectiveness" label="¿La acción fue efectiva?" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="yes">Sí, la no conformidad no se repitió</Select.Option>
              <Select.Option value="partial">Parcialmente, requiere mejora adicional</Select.Option>
              <Select.Option value="no">No, requiere nueva acción</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="evidence" label="Evidencias de verificación">
            <Input.TextArea rows={3} placeholder="Describa las evidencias que demuestran la eficacia de la acción" />
          </Form.Item>

          <Form.Item name="verifier" label="Verificado por" rules={[{ required: true }]}>
            <Input placeholder="Nombre del verificador" />
          </Form.Item>

          <Form.Item name="verificationDate" label="Fecha de Verificación" rules={[{ required: true }]} initialValue={dayjs()}>
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="comments" label="Comentarios Adicionales">
            <Input.TextArea rows={2} placeholder="Observaciones adicionales" />
          </Form.Item>

          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={() => { setModalVisible(false); setSelectedNC(null); form.resetFields(); }}>Cancelar</Button>
              <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                Cerrar No Conformidad
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default NCFollowUp;