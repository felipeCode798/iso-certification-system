import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Steps, Alert, Space, Tag, Timeline,
         message, Empty, List, Divider } from 'antd';
import { CheckCircleOutlined, SolutionOutlined, TeamOutlined, SearchOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const WHY_QUESTIONS = [
  '¿Por qué ocurrió el incidente?',
  '¿Por qué ocurrió eso? (2do nivel)',
  '¿Por qué ocurrió eso? (3er nivel)',
  '¿Por qué ocurrió lo anterior? (4to nivel)',
  '¿Cuál es la causa raíz final? (5to nivel)',
];

const IncidentResolution = ({ incidents = [], onResolve, onSelectIncident }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [currentStep, setCurrentStep]           = useState(0);
  const [whyAnswers, setWhyAnswers]              = useState(['', '', '', '', '']);
  const [form] = Form.useForm();

  // Incidentes pendientes de resolución
  const pending = incidents.filter(i => i.status === 'open' || i.status === 'inProgress');

  const handleSelectIncident = (inc) => {
    setSelectedIncident(inc);
    setCurrentStep(0);
    setWhyAnswers(['', '', '', '', '']);
    form.resetFields();
  };

  const handleWhyChange = (index, value) => {
    setWhyAnswers(prev => { const next = [...prev]; next[index] = value; return next; });
  };

  const rootCauseSummary = whyAnswers.filter(Boolean).join(' → ');

  const handleResolve = async (values) => {
    try {
      await onResolve({
        id: selectedIncident.id,
        resolution: {
          solution: values.solution,
          rootCause: rootCauseSummary,
          preventiveMeasures: values.preventiveMeasures,
          resolutionTime: Number(values.resolutionTime),
          closingNotes: values.closingNotes,
        },
      });
      setCurrentStep(2);
      message.success('Incidente resuelto exitosamente');
    } catch {
      message.error('Error al resolver el incidente');
    }
  };

  const severityColor = { critical: 'red', high: 'orange', medium: 'gold', low: 'green' };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Panel izquierdo — Lista de pendientes */}
      <div>
        <Card size="small" title={`Incidentes Pendientes (${pending.length})`}>
          {pending.length === 0
            ? <Empty description="No hay incidentes pendientes" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            : (
              <List
                size="small"
                dataSource={pending}
                renderItem={inc => (
                  <List.Item
                    className={`cursor-pointer rounded px-2 transition-colors ${selectedIncident?.id === inc.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                    onClick={() => handleSelectIncident(inc)}
                  >
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium leading-tight">{inc.title}</span>
                        <Tag color={severityColor[inc.severity]} className="ml-1 text-xs shrink-0">
                          {inc.severity}
                        </Tag>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{inc.reportedDate}</div>
                    </div>
                  </List.Item>
                )}
              />
            )
          }
        </Card>
      </div>

      {/* Panel derecho — Flujo de resolución */}
      <div className="col-span-2">
        {!selectedIncident ? (
          <Card>
            <Empty description="Selecciona un incidente de la lista para iniciar la resolución" />
          </Card>
        ) : (
          <Card
            title={
              <div className="flex items-center gap-2">
                <span>Resolviendo: </span>
                <span className="text-blue-600 font-semibold">{selectedIncident.title}</span>
                <Tag color={severityColor[selectedIncident.severity]}>{selectedIncident.severity}</Tag>
              </div>
            }
          >
            <Steps
              current={currentStep} size="small" className="mb-6"
              items={[
                { title: 'Causa Raíz', icon: <SearchOutlined />      },
                { title: 'Solución',   icon: <SolutionOutlined />    },
                { title: 'Verificado', icon: <CheckCircleOutlined /> },
              ]}
            />

            {/* PASO 0 — Análisis de los 5 Porqués */}
            {currentStep === 0 && (
              <div>
                <Alert
                  message="Análisis de Causa Raíz — Método de los 5 Porqués"
                  description="Responde cada nivel para identificar la causa raíz real del incidente."
                  type="info" showIcon className="mb-4"
                />

                <div className="mb-3 p-3 bg-gray-50 rounded border">
                  <div className="text-xs text-gray-500 mb-1">Incidente base:</div>
                  <div className="text-sm font-medium">{selectedIncident.description}</div>
                </div>

                {WHY_QUESTIONS.map((q, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{q}</span>
                    </div>
                    <TextArea
                      rows={2}
                      placeholder="Ingresa tu respuesta..."
                      value={whyAnswers[i]}
                      onChange={e => handleWhyChange(i, e.target.value)}
                      className="ml-8"
                    />
                  </div>
                ))}

                {rootCauseSummary && (
                  <Alert
                    message="Cadena causal identificada"
                    description={<span className="text-xs">{rootCauseSummary}</span>}
                    type="success" showIcon className="mt-4 mb-4"
                  />
                )}

                <Button
                  type="primary" onClick={() => setCurrentStep(1)}
                  disabled={whyAnswers[0] === ''}
                >
                  Continuar con la Solución
                </Button>
              </div>
            )}

            {/* PASO 1 — Solución */}
            {currentStep === 1 && (
              <Form form={form} layout="vertical" onFinish={handleResolve}>
                {rootCauseSummary && (
                  <Alert
                    message="Causa raíz identificada"
                    description={<span className="text-xs">{rootCauseSummary}</span>}
                    type="info" showIcon className="mb-4"
                  />
                )}

                <Form.Item
                  name="solution"
                  label="Solución Implementada"
                  rules={[{ required: true, message: 'Describe la solución aplicada' }]}
                >
                  <TextArea rows={3} placeholder="Describa en detalle la solución implementada" />
                </Form.Item>

                <Form.Item name="preventiveMeasures" label="Medidas Preventivas (para evitar recurrencia)">
                  <TextArea rows={3} placeholder="¿Qué cambios o controles se implementarán para prevenir que ocurra de nuevo?" />
                </Form.Item>

                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Item name="resolutionTime" label="Tiempo de Resolución (horas)" rules={[{ required: true }]}>
                    <Input type="number" min={0} step={0.5} placeholder="Ej: 4.5" />
                  </Form.Item>
                  <Form.Item name="closingNotes" label="Notas de Cierre">
                    <Input placeholder="Observaciones adicionales" />
                  </Form.Item>
                </div>

                <Space>
                  <Button onClick={() => setCurrentStep(0)}>← Atrás</Button>
                  <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                    Marcar como Resuelto
                  </Button>
                </Space>
              </Form>
            )}

            {/* PASO 2 — Confirmación */}
            {currentStep === 2 && (
              <div className="text-center py-4">
                <CheckCircleOutlined className="text-green-500 mb-4" style={{ fontSize: 64 }} />
                <h3 className="text-xl font-semibold mb-2 text-green-600">¡Incidente Resuelto!</h3>
                <p className="text-gray-500 mb-6">La resolución ha sido registrada y el incidente ha sido cerrado.</p>

                <Timeline
                  className="text-left max-w-sm mx-auto"
                  items={[
                    { color: 'green', children: 'Análisis de causa raíz completado (5 Porqués)' },
                    { color: 'green', children: 'Solución documentada e implementada'            },
                    { color: 'green', children: 'Medidas preventivas registradas'                },
                    { color: 'green', children: 'Incidente cerrado en el sistema'                },
                  ]}
                />

                <Button
                  type="primary" className="mt-4"
                  onClick={() => { setSelectedIncident(null); setCurrentStep(0); }}
                >
                  Resolver otro incidente
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default IncidentResolution;