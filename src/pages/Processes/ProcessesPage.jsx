// src/pages/Processes/ProcessesPage.jsx
import React, { useState } from 'react';
import { Tabs, message, Spin, Card, Row, Col, Statistic, Button } from 'antd';
import { 
  UnorderedListOutlined, ApartmentOutlined, 
  LineChartOutlined, PlusOutlined, 
  CheckCircleOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import ProcessList from '../../components/modules/processes/ProcessList';
import ProcessForm from '../../components/modules/processes/ProcessForm';
import ProcessMap from '../../components/modules/processes/ProcessMap';
import ProcessMetrics from '../../components/modules/processes/ProcessMetrics';
import {
  useGetProcessesQuery,
  useCreateProcessMutation,
  useUpdateProcessMutation,
  useDeleteProcessMutation,
  useGetProcessMetricsQuery,
} from '../../services/api/processesService';

const { TabPane } = Tabs;

const ProcessesPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [selectedForMetrics, setSelectedForMetrics] = useState(null);

  const { data: processes, isLoading, refetch } = useGetProcessesQuery();
  const createMutation = useCreateProcessMutation();
  const updateMutation = useUpdateProcessMutation();
  const deleteMutation = useDeleteProcessMutation();

  // Calcular estadísticas
  const stats = {
    total: processes?.length || 0,
    strategic: processes?.filter(p => p.type === 'strategic').length || 0,
    core: processes?.filter(p => p.type === 'core').length || 0,
    support: processes?.filter(p => p.type === 'support').length || 0,
    active: processes?.filter(p => p.status === 'active').length || 0,
    avgEffectiveness: processes?.length > 0 
      ? (processes.reduce((sum, p) => sum + (p.effectiveness || 0), 0) / processes.length).toFixed(1)
      : 0,
  };

  const handleCreate = async (values) => {
    try {
      await createMutation.mutateAsync(values);
      message.success('Proceso creado exitosamente');
      setModalVisible(false);
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al crear');
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateMutation.mutateAsync({ id: values.id, data: values });
      message.success('Proceso actualizado');
      setModalVisible(false);
      setSelectedProcess(null);
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al actualizar');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Proceso eliminado');
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleViewMetrics = (process) => {
    setSelectedForMetrics(process);
    setActiveTab('metrics');
  };

  const isLoadingData = isLoading;

  return (
    <div className="processes-page" style={{ padding: '24px' }}>
      {/* Estadísticas rápidas */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Total Procesos" 
              value={stats.total} 
              prefix={<UnorderedListOutlined />}
              loading={isLoadingData}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Estratégicos" 
              value={stats.strategic} 
              valueStyle={{ color: '#722ed1' }}
              loading={isLoadingData}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Operativos" 
              value={stats.core} 
              valueStyle={{ color: '#1890ff' }}
              loading={isLoadingData}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Soporte" 
              value={stats.support} 
              valueStyle={{ color: '#52c41a' }}
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
              title="Procesos Activos" 
              value={stats.active} 
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              loading={isLoadingData}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Eficacia Promedio" 
              value={stats.avgEffectiveness} 
              suffix="%" 
              loading={isLoadingData}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="En Revisión" 
              value={processes?.filter(p => p.status === 'review').length || 0} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
              loading={isLoadingData}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Gestión de Procesos</h1>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { 
              setSelectedProcess(null); 
              setModalVisible(true); 
            }}
          >
            Nuevo Proceso
          </Button>
        </div>

        {isLoadingData ? (
          <div className="flex justify-center py-12"><Spin size="large" /></div>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane 
              tab={<span><UnorderedListOutlined /> Lista de Procesos</span>} 
              key="list"
            >
              <ProcessList 
                processes={processes || []}
                loading={isLoadingData}
                onEdit={(process) => {
                  setSelectedProcess(process);
                  setModalVisible(true);
                }}
                onDelete={handleDelete}
                onViewMetrics={handleViewMetrics}
                onNew={() => {
                  setSelectedProcess(null);
                  setModalVisible(true);
                }}
              />
            </TabPane>
            
            <TabPane 
              tab={<span><ApartmentOutlined /> Mapa de Procesos</span>} 
              key="map"
            >
              <ProcessMap processes={processes || []} />
            </TabPane>
            
            <TabPane 
              tab={<span><LineChartOutlined /> Métricas</span>} 
              key="metrics"
            >
              <ProcessMetrics process={selectedForMetrics} />
            </TabPane>
          </Tabs>
        )}
      </Card>

      {/* Modal para crear/editar proceso */}
      <ProcessForm 
        visible={modalVisible} 
        onClose={() => { 
          setModalVisible(false); 
          setSelectedProcess(null); 
        }} 
        onSubmit={selectedProcess ? handleUpdate : handleCreate} 
        process={selectedProcess} 
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default ProcessesPage;