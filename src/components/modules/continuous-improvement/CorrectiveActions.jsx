// src/components/modules/continuous-improvement/CorrectiveActions.jsx
import React, { useState } from 'react';
import { Card, Tabs, Table, Tag, Button, Modal, Form, Input, Select, Steps, Timeline } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, FileDoneOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Step } = Steps;
const { TextArea } = Input;

const CorrectiveActions = () => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const rootCauseAnalysisSteps = [
    { title: 'Identificar Problema', status: 'finish' },
    { title: 'Análisis de Causa Raíz', status: 'process' },
    { title: 'Definir Acciones', status: 'wait' },
    { title: 'Implementar', status: 'wait' },
    { title: 'Verificar Efectividad', status: 'wait' },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'No Conformidad',
      dataIndex: 'ncReference',
      key: 'ncReference',
    },
    {
      title: 'Causa Raíz',
      dataIndex: 'rootCause',
      key: 'rootCause',
    },
    {
      title: 'Acción Correctiva',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'blue'}>
          {status === 'completed' ? 'Completada' : 'En Proceso'}
        </Tag>
      ),
    },
    {
      title: 'Eficacia',
      dataIndex: 'effectiveness',
      key: 'effectiveness',
      render: (effectiveness) => (
        <Tag color={effectiveness === 'effective' ? 'green' : 'red'}>
          {effectiveness === 'effective' ? 'Efectiva' : 'No Efectiva'}
        </Tag>
      ),
    },
  ];

  const handleAnalyze = (action) => {
    setSelectedAction(action);
    setIsModalVisible(true);
  };

  return (
    <Card title="Acciones Correctivas">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Abiertas" key="1">
          <Table columns={columns} dataSource={[]} rowKey="id" />
        </TabPane>
        <TabPane tab="En Proceso" key="2">
          <Table columns={columns} dataSource={[]} rowKey="id" />
        </TabPane>
        <TabPane tab="Completadas" key="3">
          <Table columns={columns} dataSource={[]} rowKey="id" />
        </TabPane>
      </Tabs>

      <Modal
        title="Análisis de Causa Raíz - Método 5 Porqués"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Cerrar
          </Button>,
          <Button key="save" type="primary">
            Guardar Análisis
          </Button>,
        ]}
      >
        <Steps current={1} className="mb-6">
          {rootCauseAnalysisSteps.map(step => (
            <Step key={step.title} title={step.title} status={step.status} />
          ))}
        </Steps>

        <Form layout="vertical">
          <Form.Item label="Problema">
            <TextArea rows={2} placeholder="Describa el problema" />
          </Form.Item>

          <Form.Item label="¿Por qué ocurrió? (Primer porqué)">
            <Input />
          </Form.Item>

          <Form.Item label="¿Por qué ocurrió lo anterior? (Segundo porqué)">
            <Input />
          </Form.Item>

          <Form.Item label="¿Por qué ocurrió lo anterior? (Tercer porqué)">
            <Input />
          </Form.Item>

          <Form.Item label="¿Por qué ocurrió lo anterior? (Cuarto porqué)">
            <Input />
          </Form.Item>

          <Form.Item label="Causa Raíz">
            <TextArea rows={2} placeholder="Causa raíz identificada" />
          </Form.Item>

          <Form.Item label="Acciones Correctivas Propuestas">
            <TextArea rows={3} placeholder="Describa las acciones a implementar" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CorrectiveActions;