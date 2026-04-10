// src/pages/Nonconformities/NonconformitiesPage.jsx
import React, { useState } from 'react';
import { Tabs, Button, message, Modal, Spin, Card, Row, Col, Statistic, Tag } from 'antd';
import { 
  PlusOutlined, WarningOutlined, CheckCircleOutlined, 
  ClockCircleOutlined, AuditOutlined, FileTextOutlined,
  UnorderedListOutlined, ToolOutlined 
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
  const [analysisVisible, setAnalysisVisible] = useState(false);
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
      throw error;
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
      throw error;
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
      setAnalysisVisible(false);
      setSelectedNC(null);
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al guardar análisis');
      throw error;
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

  const handleViewAnalysis = (nc) => {
    setSelectedNC(nc);
    setAnalysisVisible(true);
  };

  return (
    <div className="nonconformities-page" style={{ padding: '24px' }}>
      {/* Estadísticas rápidas */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Total NCs" 
              value={stats.total || 0} 
              prefix={<WarningOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Abiertas" 
              value={stats.open || 0} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Cerradas" 
              value={stats.closed || 0} 
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Críticas" 
              value={stats.critical || 0} 
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#f5222d' }}
              loading={statsLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* Segunda fila de estadísticas */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="En Análisis" 
              value={stats.inAnalysis || 0} 
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="En Acción" 
              value={stats.action || 0} 
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Tiempo Promedio Resolución" 
              value={stats.avgResolutionTime || 0} 
              suffix="días"
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
            Registrar NC
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spin size="large" /></div>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane 
              tab={<span><UnorderedListOutlined /> Lista de NCs ({ncs.length})</span>} 
              key="list"
            >
              <NCList 
                ncs={ncs} 
                loading={isLoading} 
                onEdit={(nc) => { 
                  setSelectedNC(nc); 
                  setModalVisible(true); 
                }} 
                onDelete={handleDelete}
                onView={handleViewAnalysis}
                onAnalyze={handleViewAnalysis}
              />
            </TabPane>
            
            <TabPane 
              tab={<span><ToolOutlined /> Análisis Causa Raíz</span>} 
              key="analysis"
            >
              {selectedNC ? (
                <NCAnalysis 
                  nc={selectedNC}
                  onSave={handleAnalyze}
                />
              ) : (
                <Card>
                  <div className="text-center py-8">
                    <p>Seleccione una NC de la lista para realizar el análisis</p>
                    <Button onClick={() => setActiveTab('list')}>Ir a la lista</Button>
                  </div>
                </Card>
              )}
            </TabPane>
            
            <TabPane 
              tab={<span><CheckCircleOutlined /> Seguimiento y Cierre</span>} 
              key="followup"
            >
              <NCFollowUp 
                ncs={ncs} 
                onUpdate={async (updatedNCs) => {
                  // Esto se maneja a través de la mutación de cierre
                  refetch();
                }}
                onClose={handleClose}
              />
            </TabPane>
          </Tabs>
        )}
      </Card>

      {/* Modal para crear/editar NC */}
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

      {/* Modal para análisis de causa raíz */}
      {selectedNC && (
        <NCAnalysis
          visible={analysisVisible}
          onClose={() => {
            setAnalysisVisible(false);
            setSelectedNC(null);
          }}
          nc={selectedNC}
          onSave={handleAnalyze}
        />
      )}
    </div>
  );
};

export default NonconformitiesPage;