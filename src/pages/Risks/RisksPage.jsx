// src/pages/Risks/RisksPage.jsx
import React, { useState } from 'react';
import { Tabs, message, Spin, Card, Row, Col, Statistic, Button } from 'antd';
import { 
  AppstoreOutlined, UnorderedListOutlined, CalculatorOutlined, 
  PlusOutlined, WarningOutlined, CheckCircleOutlined 
} from '@ant-design/icons';
import RiskMatrix from '../../components/modules/risks/RiskMatrix';
import RiskList from '../../components/modules/risks/RiskList';
import RiskAssessment from '../../components/modules/risks/RiskAssessment';
import RiskForm from '../../components/modules/risks/RiskForm';
import {
  useGetRisksQuery,
  useCreateRiskMutation,
  useUpdateRiskMutation,
  useDeleteRiskMutation,
  useGetRiskStatisticsQuery,
} from '../../services/api/risksService';

const { TabPane } = Tabs;

const RisksPage = () => {
  const [activeTab, setActiveTab] = useState('matrix');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);

  const { data: risksData, isLoading, refetch } = useGetRisksQuery();
  const { data: statsData, isLoading: statsLoading } = useGetRiskStatisticsQuery();
  const createMutation = useCreateRiskMutation();
  const updateMutation = useUpdateRiskMutation();
  const deleteMutation = useDeleteRiskMutation();

  const risks = risksData?.data || risksData || [];
  const stats = statsData?.data || statsData || {
    total: 0,
    active: 0,
    mitigated: 0,
    extreme: 0,
    high: 0,
    medium: 0,
    low: 0,
    avgRiskLevel: 0,
  };

  const handleSubmit = async (values) => {
    try {
      if (values.id) {
        await updateMutation.mutateAsync({ id: values.id, data: values });
        message.success('Riesgo actualizado');
      } else {
        await createMutation.mutateAsync(values);
        message.success('Riesgo registrado');
      }
      setIsFormVisible(false);
      setSelectedRisk(null);
      refetch();
    } catch (error) {
      console.error('Error:', error);
      message.error(error.response?.data?.message || 'Error al guardar el riesgo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Riesgo eliminado');
      refetch();
    } catch (error) {
      console.error('Error:', error);
      message.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleAssessmentUpdate = async (updatedRisk) => {
    try {
      await updateMutation.mutateAsync({ id: updatedRisk.id, data: updatedRisk });
      message.success('Evaluación guardada');
      refetch();
    } catch (error) {
      console.error('Error:', error);
      message.error(error.response?.data?.message || 'Error al actualizar evaluación');
    }
  };

  const isLoadingData = isLoading || statsLoading;

  return (
    <div className="risks-page" style={{ padding: '24px' }}>
      {/* Estadísticas rápidas */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Total Riesgos" 
              value={stats.total || 0} 
              prefix={<WarningOutlined />}
              loading={isLoadingData}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Riesgos Activos" 
              value={stats.active || 0} 
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
              loading={isLoadingData}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Riesgos Mitigados" 
              value={stats.mitigated || 0} 
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              loading={isLoadingData}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Riesgos Extremos" 
              value={stats.extreme || 0} 
              valueStyle={{ color: '#ff4d4f' }}
              loading={isLoadingData}
            />
          </Card>
        </Col>
      </Row>

      {/* Segunda fila de estadísticas */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Riesgos Altos" 
              value={stats.high || 0} 
              valueStyle={{ color: '#ff7a45' }}
              loading={isLoadingData}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Riesgos Medios" 
              value={stats.medium || 0} 
              valueStyle={{ color: '#fadb14' }}
              loading={isLoadingData}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Nivel de Riesgo Promedio" 
              value={stats.avgRiskLevel || 0} 
              suffix="pts"
              loading={isLoadingData}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Gestión de Riesgos</h1>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { 
              setSelectedRisk(null); 
              setIsFormVisible(true); 
            }}
          >
            Identificar Riesgo
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spin size="large" /></div>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane 
              tab={<span><AppstoreOutlined /> Matriz de Riesgos</span>} 
              key="matrix"
            >
              <RiskMatrix risks={risks} />
            </TabPane>
            
            <TabPane 
              tab={<span><UnorderedListOutlined /> Registro de Riesgos</span>} 
              key="list"
            >
              <RiskList 
                risks={risks}
                loading={isLoading}
                onEdit={(r) => { 
                  setSelectedRisk(r); 
                  setIsFormVisible(true); 
                }}
                onDelete={handleDelete}
                onNew={() => { 
                  setSelectedRisk(null); 
                  setIsFormVisible(true); 
                }}
              />
            </TabPane>
            
            <TabPane 
              tab={<span><CalculatorOutlined /> Evaluación</span>} 
              key="assessment"
            >
              <RiskAssessment 
                risks={risks} 
                onUpdate={handleAssessmentUpdate} 
              />
            </TabPane>
          </Tabs>
        )}
      </Card>

      {/* Modal para crear/editar riesgo */}
      <RiskForm 
        visible={isFormVisible} 
        onClose={() => { 
          setIsFormVisible(false); 
          setSelectedRisk(null); 
        }} 
        onSubmit={handleSubmit} 
        risk={selectedRisk}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default RisksPage;