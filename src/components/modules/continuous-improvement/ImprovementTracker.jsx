// src/components/modules/continuous-improvement/ImprovementTracker.jsx
import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Tag, Timeline, Button, Empty } from 'antd';
import { RiseOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const ImprovementTracker = ({ improvements = [], metrics }) => {
  const getImpactColor = (impact) => {
    const colors = { high: 'red', medium: 'orange', low: 'green' };
    return colors[impact] || 'default';
  };

  const recentImprovements = improvements.slice(0, 5).map(imp => ({
    id: imp.id,
    title: imp.description,
    date: imp.completionDate || imp.createdAt,
    impact: imp.impact || 'medium',
    status: imp.status,
  }));

  const totalImplemented = improvements.filter(i => i.status === 'completed').length;
  const implementationRate = improvements.length > 0 
    ? (totalImplemented / improvements.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Mejoras"
              value={improvements.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Implementadas"
              value={totalImplemented}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Tasa de Implementación"
              value={implementationRate.toFixed(1)}
              suffix="%"
              precision={1}
            />
            <Progress percent={implementationRate} size="small" strokeColor="#52c41a" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="En Progreso"
              value={improvements.filter(i => i.status === 'inProgress').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Mejoras Recientes">
            {recentImprovements.length === 0 ? (
              <Empty description="No hay mejoras registradas" />
            ) : (
              <List
                dataSource={recentImprovements}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Tag color={getImpactColor(item.impact)}>
                        Impacto {item.impact === 'high' ? 'Alto' : item.impact === 'medium' ? 'Medio' : 'Bajo'}
                      </Tag>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.title}
                      description={`Fecha: ${item.date ? dayjs(item.date).format('DD/MM/YYYY') : '—'}`}
                    />
                    <Tag color={item.status === 'completed' ? 'green' : item.status === 'inProgress' ? 'blue' : 'orange'}>
                      {item.status === 'completed' ? 'Implementada' : item.status === 'inProgress' ? 'En Progreso' : 'Planificada'}
                    </Tag>
                  </List.Item>
                )}
              />
            )}
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