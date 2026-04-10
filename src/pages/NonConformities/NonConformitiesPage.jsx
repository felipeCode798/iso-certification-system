// src/pages/Nonconformities/NonconformitiesPage.jsx
import React, { useState } from 'react';
import { Tabs, Button, message, Modal, Spin, Card, Row, Col, Statistic } from 'antd';
import { 
  PlusOutlined, WarningOutlined, CheckCircleOutlined, 
  ClockCircleOutlined, ExclamationCircleOutlined 
} from '@ant-design/icons';
import NCList from '../../components/modules/nonconformities/NCList';
import NCForm from '../../components/modules/nonconformities/NCForm';
import NCAnalysis from '../../components/modules/nonconformities/NCAnalysis';
import NCFollowUp from '../../components/modules/nonconformities/NCFollowUp';
import {
  useGetNCsQuery,
  useCreateNCMutation,
  useUpdateNCMutation,
  useDeleteNCMutation,
  useAnalyzeNCMutation,
  useCloseNCMutation,
  useGetNCStatisticsQuery,
} from '../../services/api/nonconformitiesService';

const { TabPane } = Tabs;

const NonconformitiesPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNC, setSelectedNC] = useState(null);

  const { data: ncsData, isLoading, refetch } = useGetNCsQuery();
  const { data: statsData, isLoading: statsLoading } = useGetNCStatisticsQuery();
  const createMutation = useCreateNCMutation();
  const updateMutation = useUpdateNCMutation();
  const deleteMutation = useDeleteNCMutation();
  const analyzeMutation = useAnalyzeNCMutation();
  const closeMutation = useCloseNCMutation();

  const ncs = ncsData?.data || ncsData || [];
  const stats = statsData?.data || statsData || {
    total: 0,
    open: 0,
    inAnalysis: 0,
    action: 0,
    closed: 0,
    critical: 0,
    major: 0,
    minor: 0,
    avgResolutionTime: 0,
  };

  const handleCreate = async (values) => {
    try {
      await createMutation.mutateAsync(values);
      message.success('No conformidad registrada exitosamente');
      setModalVisible(false);
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al crear');
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateMutation.mutateAsync({ id: values.id, data: values });
      message.success('No conformidad actualizada');
      setModalVisible(false);
      setSelectedNC(null);
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al actualizar');
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '¿Eliminar no conformidad?',
      content: 'Esta acción no se puede deshacer',
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          message.success('No conformidad eliminada');
          refetch();
        } catch (error) {
          message.error(error.response?.data?.message || 'Error al eliminar');
        }
      },
    });
  };

  const handleAnalyze = async (analysisData) => {
    try {
      await analyzeMutation.mutateAsync({ id: selectedNC.id, data: analysisData });
      message.success('Análisis guardado exitosamente');
      setSelectedNC(null);
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al guardar análisis');
    }
  };

  const handleClose = async (ncId, closureData) => {
    try {
      await closeMutation.mutateAsync({ id: ncId, data: closureData });
      message.success('No conformidad cerrada exitosamente');
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al cerrar');
    }
  };

  const handleViewForAnalysis = (nc) => {
    setSelectedNC(nc);
    setActiveTab('analysis');
  };

  const statsDataDisplay = {
    total: stats.total || 0,
    open: stats.open || 0,
    inAnalysis: stats.inAnalysis || 0,
    closed: stats.closed || 0,
    critical: stats.critical || 0,
  };

  return (
    <div className="nonconformities-page" style={{ padding: '24px' }}>
      {/* Estadísticas rápidas - IGUAL QUE EL ORIGINAL */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Total No Conformidades" 
              value={statsDataDisplay.total} 
              prefix={<ExclamationCircleOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Abiertas" 
              value={statsDataDisplay.open} 
              prefix={<WarningOutlined />} 
              valueStyle={{ color: '#faad14' }}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="En Análisis" 
              value={statsDataDisplay.inAnalysis} 
              prefix={<ClockCircleOutlined />} 
              valueStyle={{ color: '#1890ff' }}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Cerradas" 
              value={statsDataDisplay.closed} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#52c41a' }}
              loading={statsLoading}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Gestión de No Conformidades</h1>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { 
              setSelectedNC(null); 
              setModalVisible(true); 
            }}
          >
            Registrar No Conformidad
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spin size="large" /></div>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            {/* TAB 1: No Conformidades (lista) */}
            <TabPane tab={`No Conformidades (${ncs.length})`} key="list">
              <NCList 
                ncs={ncs} 
                loading={isLoading} 
                onEdit={(nc) => { 
                  setSelectedNC(nc); 
                  setModalVisible(true); 
                }} 
                onDelete={handleDelete}
                onView={handleViewForAnalysis}
              />
            </TabPane>

            {/* TAB 2: Registrar NC (formulario) */}
            <TabPane tab="Registrar NC" key="register">
              <div className="p-4">
                <NCForm 
                  visible={modalVisible} 
                  onClose={() => { 
                    setModalVisible(false); 
                    setSelectedNC(null); 
                  }} 
                  onSubmit={selectedNC ? handleUpdate : handleCreate} 
                  nc={selectedNC} 
                  loading={createMutation.isPending || updateMutation.isPending}
                />
                {!modalVisible && (
                  <div className="text-center py-8">
                    <p>Haga clic en "Registrar No Conformidad" para crear una nueva</p>
                    <Button 
                      type="primary" 
                      onClick={() => {
                        setSelectedNC(null);
                        setModalVisible(true);
                      }}
                    >
                      Registrar No Conformidad
                    </Button>
                  </div>
                )}
              </div>
            </TabPane>

            {/* TAB 3: Análisis Causa Raíz */}
            <TabPane tab="Análisis Causa Raíz" key="analysis">
              {selectedNC ? (
                <NCAnalysis 
                  visible={true}
                  onClose={() => setSelectedNC(null)}
                  nc={selectedNC}
                  onSave={handleAnalyze}
                />
              ) : (
                <div className="text-center py-8">
                  <p>Seleccione una no conformidad de la lista para analizar</p>
                  <Button onClick={() => setActiveTab('list')}>Ir a la lista</Button>
                </div>
              )}
            </TabPane>

            {/* TAB 4: Seguimiento */}
            <TabPane tab="Seguimiento" key="followup">
              <NCFollowUp 
                ncs={ncs} 
                onClose={handleClose}
              />
            </TabPane>
          </Tabs>
        )}
      </Card>

      {/* Modal para crear/editar NC (se mantiene por si acaso) */}
      <NCForm 
        visible={modalVisible} 
        onClose={() => { 
          setModalVisible(false); 
          setSelectedNC(null); 
        }} 
        onSubmit={selectedNC ? handleUpdate : handleCreate} 
        nc={selectedNC} 
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default NonconformitiesPage;