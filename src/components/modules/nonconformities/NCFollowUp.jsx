// src/components/modules/nonconformities/NCFollowUp.jsx
import React, { useState } from 'react';
import { Card, Table, Tag, Button, Timeline, Progress, Modal, Form, Input, Space, DatePicker, Select, message } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined, 
  ExclamationCircleOutlined,
  CloseCircleOutlined  // 👈 Agregar esta importación
} from '@ant-design/icons';
import dayjs from 'dayjs';

const NCFollowUp = ({ ncs = [], onClose: onCloseNC }) => {
  const [selectedNC, setSelectedNC] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { color: 'red', text: 'Crítica' },
      major: { color: 'orange', text: 'Mayor' },
      minor: { color: 'gold', text: 'Menor' },
    };
    return configs[severity] || configs.minor;
  };

  const columns = [
    { title: 'ID NC', dataIndex: 'id', key: 'id', width: 80 },
    { 
      title: 'Descripción', 
      dataIndex: 'description', 
      key: 'description', 
      ellipsis: true 
    },
    { 
      title: 'Severidad', 
      dataIndex: 'severity', 
      key: 'severity', 
      width: 100,
      render: (severity) => {
        const config = getSeverityConfig(severity);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    { 
      title: 'Acción Correctiva', 
      dataIndex: 'correctiveActions', 
      key: 'correctiveActions', 
      ellipsis: true,
      render: (actions) => actions || 'No definida'
    },
    { 
      title: 'Responsable', 
      dataIndex: 'responsible', 
      key: 'responsible',
      render: (responsible) => responsible || 'No asignado'
    },
    { 
      title: 'Progreso', 
      key: 'progress', 
      width: 120,
      render: (_, record) => (
        <Progress 
          percent={record.progress || 0} 
          size="small" 
          strokeColor={record.progress === 100 ? '#52c41a' : '#1890ff'}
        />
      ) 
    },
    { 
      title: 'Estado', 
      dataIndex: 'status', 
      key: 'status', 
      width: 120,
      render: (status) => {
        const configs = {
          open: { color: 'error', text: 'Abierta' },
          inAnalysis: { color: 'warning', text: 'En Análisis' },
          action: { color: 'processing', text: 'En Acción' },
          closed: { color: 'success', text: 'Cerrada' },
        };
        const config = configs[status] || configs.open;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    { 
      title: 'Verificación', 
      key: 'verification', 
      width: 100,
      render: (_, record) => (
        <Button 
          size="small" 
          icon={<CheckCircleOutlined />} 
          onClick={() => { 
            setSelectedNC(record); 
            setModalVisible(true); 
          }}
          disabled={record.status === 'closed'}
        >
          Verificar
        </Button>
      )
    },
  ];

  const handleVerify = async (values) => {
    try {
      await onCloseNC(selectedNC.id, {
        effectiveness: values.effectiveness,
        evidence: values.evidence,
        verifier: values.verifier,
        verificationDate: values.verificationDate?.format('YYYY-MM-DD'),
        comments: values.comments,
      });
      message.success('No conformidad cerrada exitosamente');
      setModalVisible(false);
      setSelectedNC(null);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al cerrar');
    }
  };

  const openNCs = ncs.filter(nc => nc.status !== 'closed');

  return (
    <Card title="Seguimiento de No Conformidades">
      <Table 
        columns={columns} 
        dataSource={openNCs} 
        rowKey="id"
        pagination={{ pageSize: 10, showTotal: (total) => `${total} NCs abiertas` }}
      />

      <Modal
        title={`Verificación de Eficacia - NC #${selectedNC?.id}`}
        open={modalVisible}
        onCancel={() => { 
          setModalVisible(false); 
          setSelectedNC(null); 
          form.resetFields(); 
        }}
        width={700}
        footer={null}
        destroyOnClose
      >
        <Card size="small" className="mb-4" style={{ background: '#fafafa' }}>
          <p><strong>No Conformidad:</strong> {selectedNC?.description}</p>
          <p><strong>Acción Correctiva:</strong> {selectedNC?.correctiveActions || 'No definida'}</p>
          <p><strong>Responsable:</strong> {selectedNC?.responsible || 'No asignado'}</p>
          <p><strong>Fecha Límite:</strong> {selectedNC?.deadline || 'No definida'}</p>
        </Card>

        <Form form={form} layout="vertical" onFinish={handleVerify}>
          <Form.Item 
            name="effectiveness" 
            label="¿La acción fue efectiva?" 
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="yes">
                <CheckCircleOutlined className="text-green-500" /> Sí, la no conformidad no se repitió
              </Select.Option>
              <Select.Option value="partial">
                <ExclamationCircleOutlined className="text-orange-500" /> Parcialmente, requiere mejora adicional
              </Select.Option>
              <Select.Option value="no">
                <CloseCircleOutlined className="text-red-500" /> No, requiere nueva acción
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="evidence" 
            label="Evidencias de verificación"
            rules={[{ required: true }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Describa las evidencias que demuestran la eficacia de la acción" 
            />
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
            initialValue={dayjs()}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="comments" label="Comentarios Adicionales">
            <Input.TextArea rows={2} placeholder="Observaciones adicionales" />
          </Form.Item>

          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={() => { 
                setModalVisible(false); 
                setSelectedNC(null); 
                form.resetFields(); 
              }}>
                Cancelar
              </Button>
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