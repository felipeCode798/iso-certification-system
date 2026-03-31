// src/components/modules/continuous-improvement/ImprovementTracker.jsx
import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Tag, Timeline, Button } from 'antd';
import { RiseOutlined, FallOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const ImprovementTracker = ({ improvements, metrics }) => {
  const calculateTrend = () => {
    // Calcular tendencia de mejora
    return {
      totalImprovements: improvements?.length || 0,
      implemented: improvements?.filter(i => i.status === 'implemented').length || 0,
      effectiveness: 85,
    };
  };

  const trend = calculateTrend();

  const recentImprovements = [
    { title: 'Optimización de procesos', date: '2024-01-15', impact: 'Alto', status: 'implemented' },
    { title: 'Automatización de reportes', date: '2024-01-10', impact: 'Medio', status: 'inProgress' },
    { title: 'Mejora en tiempos de respuesta', date: '2024-01-05', impact: 'Alto', status: 'planned' },
  ];

  return (
    <div className="space-y-6">
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Mejoras"
              value={trend.totalImprovements}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Implementadas"
              value={trend.implemented}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tasa de Implementación"
              value={trend.effectiveness}
              suffix="%"
              precision={1}
            />
            <Progress percent={trend.effectiveness} size="small" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Ahorro Estimado"
              value={125000}
              prefix="$"
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Mejoras Recientes">
            <List
              dataSource={recentImprovements}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Tag color={item.impact === 'Alto' ? 'red' : 'orange'}>
                      Impacto {item.impact}
                    </Tag>,
                  ]}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={`Fecha: ${item.date}`}
                  />
                  <Tag color={item.status === 'implemented' ? 'green' : item.status === 'inProgress' ? 'blue' : 'default'}>
                    {item.status === 'implemented' ? 'Implementada' : item.status === 'inProgress' ? 'En Progreso' : 'Planificada'}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Ciclo de Mejora Continua (PDCA)">
            <Timeline mode="left">
              <Timeline.Item label="Planificar" color="blue">
                Identificar oportunidades y planificar acciones
              </Timeline.Item>
              <Timeline.Item label="Hacer" color="green">
                Implementar las acciones planificadas
              </Timeline.Item>
              <Timeline.Item label="Verificar" color="orange">
                Evaluar resultados y efectividad
              </Timeline.Item>
              <Timeline.Item label="Actuar" color="purple">
                Estandarizar mejoras exitosas
              </Timeline.Item>
            </Timeline>
            <Button type="primary" block className="mt-4">
              Iniciar Nuevo Ciclo de Mejora
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ImprovementTracker;