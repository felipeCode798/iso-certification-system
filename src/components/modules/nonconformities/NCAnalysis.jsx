// src/components/modules/nonconformities/NCAnalysis.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Steps, Form, Input, Button, Card, Timeline, Tag, Space, message, DatePicker, Select, Spin } from 'antd';
import { CheckCircleOutlined, SolutionOutlined, ToolOutlined, AuditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Step } = Steps;
const { TextArea } = Input;

const NCAnalysis = ({ visible, onClose, nc, onSave }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [rootCauseAnswers, setRootCauseAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && nc) {
      // Si ya tiene análisis previo, cargarlo
      if (nc.whyAnalysis && nc.whyAnalysis.length > 0) {
        const whyValues = {};
        nc.whyAnalysis.forEach((answer, idx) => {
          whyValues[`why${idx + 1}`] = answer;
        });
        form.setFieldsValue({
          ...whyValues,
          correctiveActions: nc.correctiveActions,
          preventiveActions: nc.preventiveActions,
          responsible: nc.responsible,
          deadline: nc.deadline ? dayjs(nc.deadline) : dayjs().add(15, 'day'),
        });
        setRootCauseAnswers(nc.whyAnalysis);
        setCurrentStep(2);
      } else {
        form.resetFields();
        setRootCauseAnswers([]);
        setCurrentStep(0);
      }
    }
  }, [visible, nc, form]);

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
    setRootCauseAnswers(whyAnswers);
    setCurrentStep(2);
  };

  const handleSubmitActions = async (values) => {
    setLoading(true);
    const analysis = {
      whyAnalysis: rootCauseAnswers,
      rootCause: rootCauseAnswers[rootCauseAnswers.length - 1] || '',
      correctiveActions: values.correctiveActions,
      preventiveActions: values.preventiveActions,
      responsible: values.responsible,
      deadline: values.deadline?.format('YYYY-MM-DD'),
    };
    await onSave(analysis);
    setLoading(false);
    setCurrentStep(3);
  };

  if (!nc) return null;

  const getSeverityColor = () => {
    const colors = { critical: 'red', major: 'orange', minor: 'gold' };
    return colors[nc.severity] || 'default';
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span>Análisis de Causa Raíz</span>
          <Tag color={getSeverityColor()}>NC #{nc.id}</Tag>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
      destroyOnClose
    >
      <Steps current={currentStep} className="mb-8">
        {steps.map(step => (
          <Step key={step.title} title={step.title} icon={step.icon} />
        ))}
      </Steps>

      {currentStep === 0 && (
        <Card>
          <h4 className="font-semibold mb-2">No Conformidad</h4>
          <p>{nc.description}</p>
          <Space className="mt-2">
            <Tag color={getSeverityColor()}>{nc.severity?.toUpperCase()}</Tag>
            <Tag>{nc.source}</Tag>
            {nc.standard && <Tag color="geekblue">{nc.standard?.toUpperCase()}</Tag>}
          </Space>
          {nc.clause && (
            <div className="mt-2">
              <Tag color="blue">Cláusula: {nc.clause}</Tag>
            </div>
          )}
          <div className="mt-4">
            <Button type="primary" onClick={() => setCurrentStep(1)}>
              Iniciar Análisis
            </Button>
          </div>
        </Card>
      )}

      {currentStep === 1 && (
        <Form form={form} onFinish={handleWhyAnalysis} layout="vertical">
          <h4 className="font-semibold mb-4">Método de los 5 Porqués</h4>
          <p className="text-gray-500 mb-4">
            Responda las siguientes preguntas para identificar la causa raíz:
          </p>
          {[1, 2, 3, 4, 5].map((num) => (
            <Form.Item
              key={num}
              name={`why${num}`}
              label={`${num}. ¿Por qué ocurrió?`}
              rules={[{ required: num === 1, message: 'Este campo es requerido' }]}
            >
              <TextArea 
                rows={2} 
                placeholder={`Responda el porqué número ${num}`} 
              />
            </Form.Item>
          ))}
          <Form.Item>
            <Space>
              <Button onClick={() => setCurrentStep(0)}>Atrás</Button>
              <Button type="primary" htmlType="submit">
                Analizar Causa Raíz
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}

      {currentStep === 2 && (
        <Form
          form={form}
          onFinish={handleSubmitActions}
          layout="vertical"
          initialValues={{
            deadline: dayjs().add(15, 'day'),
          }}
        >
          <Card className="mb-4">
            <h4 className="font-semibold mb-2">Causa Raíz Identificada</h4>
            <Timeline>
              {rootCauseAnswers.map((cause, idx) => (
                <Timeline.Item 
                  key={idx} 
                  color={idx === rootCauseAnswers.length - 1 ? 'red' : 'blue'}
                >
                  {cause}
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>

          <Form.Item
            name="correctiveActions"
            label="Acciones Correctivas"
            rules={[{ required: true, message: 'Ingrese las acciones correctivas' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Acciones para eliminar la causa raíz" 
            />
          </Form.Item>

          <Form.Item name="preventiveActions" label="Acciones Preventivas">
            <TextArea 
              rows={3} 
              placeholder="Acciones para prevenir recurrencia" 
            />
          </Form.Item>

          <Form.Item
            name="responsible"
            label="Responsable de Implementación"
            rules={[{ required: true }]}
          >
            <Select placeholder="Seleccione el responsable">
              <Select.Option value="Juan Pérez">Juan Pérez</Select.Option>
              <Select.Option value="María López">María López</Select.Option>
              <Select.Option value="Carlos Ruiz">Carlos Ruiz</Select.Option>
              <Select.Option value="Ana Martínez">Ana Martínez</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Fecha Límite"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setCurrentStep(1)}>Atrás</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Guardar Análisis
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}

      {currentStep === 3 && (
        <Card className="text-center">
          <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
          <h3 className="mt-4">Análisis Completado</h3>
          <p>Las acciones correctivas han sido registradas.</p>
          <Button type="primary" onClick={onClose}>
            Cerrar
          </Button>
        </Card>
      )}
    </Modal>
  );
};

export default NCAnalysis;