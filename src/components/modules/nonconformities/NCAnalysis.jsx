// src/components/modules/nonconformities/NCAnalysis.jsx
import React, { useState } from 'react';
import { Modal, Steps, Form, Input, Button, Card, Timeline, Tag, Space, message } from 'antd';
import { CheckCircleOutlined, SolutionOutlined, ToolOutlined, AuditOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { TextArea } = Input;

const NCAnalysis = ({ visible, onClose, nc }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [rootCause, setRootCause] = useState([]);

  const steps = [
    { title: 'Identificación', icon: <SolutionOutlined /> },
    { title: 'Análisis Causa Raíz', icon: <ToolOutlined /> },
    { title: 'Acciones', icon: <CheckCircleOutlined /> },
    { title: 'Verificación', icon: <AuditOutlined /> },
  ];

  const handleWhyAnalysis = (values) => {
    const whyAnswers = [];
    for (let i = 1; i <= 5; i++) {
      if (values[`why${i}`]) {
        whyAnswers.push(values[`why${i}`]);
      }
    }
    setRootCause(whyAnswers);
    setCurrentStep(2);
  };

  const handleSubmitActions = async (values) => {
    const analysis = {
      ncId: nc?.id,
      rootCause: rootCause,
      correctiveActions: values.correctiveActions,
      preventiveActions: values.preventiveActions,
      responsible: values.responsible,
      deadline: values.deadline,
    };
    console.log('Análisis completado:', analysis);
    message.success('Análisis guardado exitosamente');
    onClose();
  };

  return (
    <Modal
      title={`Análisis de Causa Raíz - NC #${nc?.id}`}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <Steps current={currentStep} className="mb-8">
        {steps.map(step => (
          <Step key={step.title} title={step.title} icon={step.icon} />
        ))}
      </Steps>

      {currentStep === 0 && (
        <Card>
          <h4 className="font-semibold mb-2">No Conformidad</h4>
          <p>{nc?.description}</p>
          <Space className="mt-2">
            <Tag color="red">{nc?.severity}</Tag>
            <Tag>{nc?.source}</Tag>
            <Tag>{nc?.standard}</Tag>
          </Space>
          <div className="mt-4">
            <Button type="primary" onClick={() => setCurrentStep(1)}>
              Iniciar Análisis
            </Button>
          </div>
        </Card>
      )}

      {currentStep === 1 && (
        <Form onFinish={handleWhyAnalysis} layout="vertical">
          <h4 className="font-semibold mb-4">Método de los 5 Porqués</h4>
          {[1, 2, 3, 4, 5].map((num) => (
            <Form.Item
              key={num}
              name={`why${num}`}
              label={`${num}. ¿Por qué ocurrió?`}
              rules={[{ required: num === 1, message: 'Este campo es requerido' }]}
            >
              <TextArea rows={2} placeholder={`Responda el porqué número ${num}`} />
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Analizar Causa Raíz
            </Button>
          </Form.Item>
        </Form>
      )}

      {currentStep === 2 && (
        <Form onFinish={handleSubmitActions} layout="vertical">
          <Card className="mb-4">
            <h4 className="font-semibold mb-2">Causa Raíz Identificada</h4>
            <Timeline>
              {rootCause.map((cause, idx) => (
                <Timeline.Item key={idx}>{cause}</Timeline.Item>
              ))}
            </Timeline>
          </Card>

          <Form.Item
            name="correctiveActions"
            label="Acciones Correctivas"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} placeholder="Acciones para eliminar la causa raíz" />
          </Form.Item>

          <Form.Item
            name="preventiveActions"
            label="Acciones Preventivas"
          >
            <TextArea rows={3} placeholder="Acciones para prevenir recurrencia" />
          </Form.Item>

          <Form.Item
            name="responsible"
            label="Responsable de Implementación"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nombre del responsable" />
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Fecha Límite"
            rules={[{ required: true }]}
          >
            <Input placeholder="DD/MM/AAAA" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setCurrentStep(1)}>Atrás</Button>
              <Button type="primary" htmlType="submit">
                Guardar Análisis
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default NCAnalysis;