// src/components/modules/continuous-improvement/CorrectiveActions.jsx
import React, { useState } from 'react';
import { Card, Tabs, Table, Tag, Button, Modal, Form, Input, Select, Steps, Timeline, Space, message, DatePicker } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ExclamationCircleOutlined, FileDoneOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Step } = Steps;
const { TextArea } = Input;

const CorrectiveActions = ({ actions = [], onCreate, onVerify }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [form] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [whyAnswers, setWhyAnswers] = useState(['', '', '', '', '']);

  const getStatusConfig = (status) => {
    const configs = {
      open: { color: 'orange', text: 'Abierta' },
      inProcess: { color: 'blue', text: 'En Proceso' },
      completed: { color: 'green', text: 'Completada' },
      verified: { color: 'purple', text: 'Verificada' },
    };
    return configs[status] || configs.open;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'No Conformidad',
      dataIndex: 'ncReference',
      key: 'ncReference',
      width: 120,
    },
    {
      title: 'Causa Raíz',
      dataIndex: 'rootCause',
      key: 'rootCause',
      ellipsis: true,
    },
    {
      title: 'Acción Correctiva',
      dataIndex: 'action',
      key: 'action',
      ellipsis: true,
    },
    {
      title: 'Responsable',
      dataIndex: 'responsible',
      key: 'responsible',
      width: 150,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Eficacia',
      dataIndex: 'effectiveness',
      key: 'effectiveness',
      width: 100,
      render: (effectiveness) => {
        if (!effectiveness) return '—';
        return (
          <Tag color={effectiveness === 'effective' ? 'green' : effectiveness === 'partial' ? 'orange' : 'red'}>
            {effectiveness === 'effective' ? 'Efectiva' : effectiveness === 'partial' ? 'Parcial' : 'No Efectiva'}
          </Tag>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => {
              setSelectedAction(record);
              setIsVerifyModalVisible(true);
            }}
          >
            Verificar
          </Button>
        </Space>
      ),
    },
  ];

  const handleWhyChange = (index, value) => {
    const newAnswers = [...whyAnswers];
    newAnswers[index] = value;
    setWhyAnswers(newAnswers);
  };

  const handleSubmit = async (values) => {
    try {
      const correctiveData = {
        ...values,
        whyAnalysis: whyAnswers.filter(a => a),
        rootCause: whyAnswers[4] || whyAnswers.filter(a => a).pop() || '',
        deadline: values.deadline?.format('YYYY-MM-DD'),
      };
      await onCreate(correctiveData);
      message.success('Acción correctiva creada');
      setIsModalVisible(false);
      form.resetFields();
      setWhyAnswers(['', '', '', '', '']);
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al crear');
    }
  };

  const handleVerify = async (values) => {
    try {
      const verifyData = {
        ...values,
        verificationDate: values.verificationDate?.format('YYYY-MM-DD'),
      };
      await onVerify(selectedAction.id, verifyData);
      message.success('Acción correctiva verificada');
      setIsVerifyModalVisible(false);
      setSelectedAction(null);
      verifyForm.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al verificar');
    }
  };

  const openActions = actions.filter(a => a.status !== 'verified' && a.status !== 'completed');
  const inProcessActions = actions.filter(a => a.status === 'inProcess');
  const completedActions = actions.filter(a => a.status === 'completed' || a.status === 'verified');

  return (
    <Card 
      title="Acciones Correctivas"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Nueva Acción Correctiva
        </Button>
      }
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab={`Abiertas (${openActions.length})`} key="1">
          <Table columns={columns} dataSource={openActions} rowKey="id" pagination={false} />
        </TabPane>
        <TabPane tab={`En Proceso (${inProcessActions.length})`} key="2">
          <Table columns={columns} dataSource={inProcessActions} rowKey="id" pagination={false} />
        </TabPane>
        <TabPane tab={`Completadas (${completedActions.length})`} key="3">
          <Table columns={columns} dataSource={completedActions} rowKey="id" pagination={false} />
        </TabPane>
      </Tabs>

      {/* Modal para crear acción correctiva */}
      <Modal
        title="Análisis de Causa Raíz - Método 5 Porqués"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setWhyAnswers(['', '', '', '', '']);
        }}
        width={800}
        footer={null}
        destroyOnClose
      >
        <Steps current={1} className="mb-6" size="small">
          <Step title="Problema" />
          <Step title="5 Porqués" />
          <Step title="Acciones" />
        </Steps>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="ncReference"
            label="Referencia de No Conformidad"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ej: NC-001" />
          </Form.Item>

          <Form.Item
            name="problem"
            label="Problema"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} placeholder="Describa el problema identificado" />
          </Form.Item>

          <div className="mb-4">
            <h4 className="font-semibold">Análisis de Causa Raíz (5 Porqués)</h4>
            {[1, 2, 3, 4, 5].map((num) => (
              <Form.Item
                key={num}
                label={`${num}. ¿Por qué ocurrió?`}
                required={num === 1}
              >
                <Input 
                  value={whyAnswers[num - 1]}
                  onChange={(e) => handleWhyChange(num - 1, e.target.value)}
                  placeholder={`Responda el porqué número ${num}`}
                />
              </Form.Item>
            ))}
          </div>

          <Form.Item
            name="action"
            label="Acción Correctiva Propuesta"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} placeholder="Describa las acciones a implementar" />
          </Form.Item>

          <Form.Item name="responsible" label="Responsable">
            <Select placeholder="Seleccione el responsable">
              <Select.Option value="Juan Pérez">Juan Pérez</Select.Option>
              <Select.Option value="María López">María López</Select.Option>
              <Select.Option value="Carlos Ruiz">Carlos Ruiz</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="deadline" label="Fecha Límite">
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Crear Acción Correctiva
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setWhyAnswers(['', '', '', '', '']);
              }}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para verificar eficacia */}
      <Modal
        title={`Verificación de Eficacia - Acción Correctiva #${selectedAction?.id}`}
        open={isVerifyModalVisible}
        onCancel={() => {
          setIsVerifyModalVisible(false);
          setSelectedAction(null);
          verifyForm.resetFields();
        }}
        width={600}
        footer={null}
        destroyOnClose
      >
        <Card size="small" className="mb-4" style={{ background: '#fafafa' }}>
          <p><strong>Problema:</strong> {selectedAction?.problem}</p>
          <p><strong>Causa Raíz:</strong> {selectedAction?.rootCause}</p>
          <p><strong>Acción:</strong> {selectedAction?.action}</p>
          <p><strong>Responsable:</strong> {selectedAction?.responsible || 'No asignado'}</p>
        </Card>

        <Form form={verifyForm} layout="vertical" onFinish={handleVerify}>
          <Form.Item
            name="effectiveness"
            label="¿La acción fue efectiva?"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="effective">Sí, completamente efectiva</Select.Option>
              <Select.Option value="partial">Parcialmente, requiere mejora adicional</Select.Option>
              <Select.Option value="notEffective">No, no fue efectiva</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="verificationEvidence"
            label="Evidencias de verificación"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} placeholder="Describa las evidencias que demuestran la eficacia" />
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

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Confirmar Verificación
              </Button>
              <Button onClick={() => {
                setIsVerifyModalVisible(false);
                setSelectedAction(null);
                verifyForm.resetFields();
              }}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CorrectiveActions;