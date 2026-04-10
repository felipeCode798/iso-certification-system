// src/pages/Improvement/ImprovementPage.jsx
import React, { useState } from 'react';
import { Tabs, Button, message, Spin, Card, Row, Col, Statistic } from 'antd';
import { 
  RiseOutlined, CheckCircleOutlined, ClockCircleOutlined, 
  WarningOutlined, FileTextOutlined 
} from '@ant-design/icons';
import ActionPlan from '../../components/modules/continuous-improvement/ActionPlan';
import CorrectiveActions from '../../components/modules/continuous-improvement/CorrectiveActions';
import PreventiveActions from '../../components/modules/continuous-improvement/PreventiveActions';
import ImprovementTracker from '../../components/modules/continuous-improvement/ImprovementTracker';
import {
  useGetActionPlansQuery,
  useGetCorrectiveActionsQuery,
  useGetPreventiveActionsQuery,
  useGetImprovementStatisticsQuery,
  useCreateActionPlanMutation,
  useUpdateActionPlanMutation,
  useCreateCorrectiveActionMutation,
  useCreatePreventiveActionMutation,
  useVerifyCorrectiveActionMutation,
} from '../../services/api/improvementService';

const { TabPane } = Tabs;

const ImprovementPage = () => {
  const [activeTab, setActiveTab] = useState('tracker');

  // Queries
  const { data: actionsData, isLoading: actionsLoading, refetch: refetchActions } = useGetActionPlansQuery();
  const { data: correctiveData, isLoading: correctiveLoading, refetch: refetchCorrective } = useGetCorrectiveActionsQuery();
  const { data: preventiveData, isLoading: preventiveLoading, refetch: refetchPreventive } = useGetPreventiveActionsQuery();
  const { data: statsData, isLoading: statsLoading } = useGetImprovementStatisticsQuery();

  // Mutations
  const createActionMutation = useCreateActionPlanMutation();
  const updateActionMutation = useUpdateActionPlanMutation();
  const createCorrectiveMutation = useCreateCorrectiveActionMutation();
  const createPreventiveMutation = useCreatePreventiveActionMutation();
  const verifyCorrectiveMutation = useVerifyCorrectiveActionMutation();

  // Extraer datos
  const actions = actionsData?.data || actionsData || [];
  const correctiveActions = correctiveData?.data || correctiveData || [];
  const preventiveActions = preventiveData?.data || preventiveData || [];
  const stats = statsData?.data || statsData || {
    actionPlan: { total: 0, completed: 0, inProgress: 0 },
    correctiveAction: { total: 0, open: 0, completed: 0, effective: 0 },
    preventiveAction: { total: 0, open: 0, completed: 0 },
  };

  // Handlers para Action Plan
  const handleAddAction = async (values) => {
    try {
      await createActionMutation.mutateAsync(values);
      message.success('Acción creada exitosamente');
      refetchActions();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al crear acción');
    }
  };

  const handleUpdateAction = async (id, values) => {
    try {
      await updateActionMutation.mutateAsync({ id, data: values });
      message.success('Acción actualizada');
      refetchActions();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al actualizar');
    }
  };

  // Handlers para Corrective Actions
  const handleCreateCorrective = async (values) => {
    try {
      await createCorrectiveMutation.mutateAsync(values);
      message.success('Acción correctiva creada');
      refetchCorrective();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al crear');
    }
  };

  const handleVerifyCorrective = async (id, values) => {
    try {
      await verifyCorrectiveMutation.mutateAsync({ id, data: values });
      message.success('Acción correctiva verificada');
      refetchCorrective();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al verificar');
    }
  };

  // Handlers para Preventive Actions
  const handleCreatePreventive = async (values) => {
    try {
      await createPreventiveMutation.mutateAsync(values);
      message.success('Acción preventiva creada');
      refetchPreventive();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al crear');
    }
  };

  const isLoading = actionsLoading || correctiveLoading || preventiveLoading || statsLoading;

  return (
    <div className="improvement-page" style={{ padding: '24px' }}>
      {/* Estadísticas rápidas */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Total Acciones" 
              value={stats.actionPlan?.total || 0} 
              prefix={<FileTextOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Acciones Completadas" 
              value={stats.actionPlan?.completed || 0} 
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Acciones Correctivas" 
              value={stats.correctiveAction?.total || 0} 
              prefix={<WarningOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Acciones Preventivas" 
              value={stats.preventiveAction?.total || 0} 
              prefix={<RiseOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Gestión de Mejora Continua</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spin size="large" /></div>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Seguimiento" key="tracker">
              <ImprovementTracker 
                improvements={actions}
                metrics={stats}
              />
            </TabPane>
            
            <TabPane tab="Plan de Acción" key="plan">
              <ActionPlan 
                actions={actions}
                onAdd={handleAddAction}
                onUpdate={handleUpdateAction}
              />
            </TabPane>
            
            <TabPane tab="Acciones Correctivas" key="corrective">
              <CorrectiveActions 
                actions={correctiveActions}
                onCreate={handleCreateCorrective}
                onVerify={handleVerifyCorrective}
              />
            </TabPane>
            
            <TabPane tab="Acciones Preventivas" key="preventive">
              <PreventiveActions 
                actions={preventiveActions}
                onCreate={handleCreatePreventive}
              />
            </TabPane>
          </Tabs>
        )}
      </Card>
    </div>
  );
};

export default ImprovementPage;