// src/pages/Training/TrainingPage.jsx
import React, { useState } from 'react';
import { Tabs, Button, message, Modal, Empty, Spin, Card, Row, Col, Statistic } from 'antd';
import { 
  PlusOutlined, CalendarOutlined, TeamOutlined, 
  BookOutlined, TrophyOutlined, ProfileOutlined 
} from '@ant-design/icons';
import TrainingList from '../../components/modules/training/TrainingList';
import TrainingForm from '../../components/modules/training/TrainingForm';
import CompetencyMatrix from '../../components/modules/training/CompetencyMatrix';
import TrainingCalendar from '../../components/modules/training/TrainingCalendar';
import {
  useGetTrainingsQuery,
  useCreateTrainingMutation,
  useUpdateTrainingMutation,
  useDeleteTrainingMutation,
  useEnrollTrainingMutation,
  useGetTrainingStatisticsQuery,
} from '../../services/api/trainingService';

const { TabPane } = Tabs;

const TrainingPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);

  const { data: trainingsData, isLoading, refetch } = useGetTrainingsQuery();
  const { data: statsData } = useGetTrainingStatisticsQuery();
  const createMutation = useCreateTrainingMutation();
  const updateMutation = useUpdateTrainingMutation();
  const deleteMutation = useDeleteTrainingMutation();
  const enrollMutation = useEnrollTrainingMutation();
  
  const trainings = trainingsData?.data || trainingsData || [];
  const stats = statsData?.data || statsData || {
    total: 0,
    totalEnrollments: 0,
    avgCompetency: 0,
    upcoming: 0,
  };

  const handleCreate = async (values) => {
    try {
      await createMutation.mutateAsync(values);
      message.success('Capacitación programada exitosamente');
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
      message.success('Capacitación actualizada');
      setModalVisible(false);
      setSelectedTraining(null);
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al actualizar');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '¿Eliminar capacitación?',
      content: 'Esta acción no se puede deshacer',
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          message.success('Capacitación eliminada');
          refetch();
        } catch (error) {
          message.error(error.response?.data?.message || 'Error al eliminar');
        }
      },
    });
  };

  const handleView = (training) => {
    setSelectedTraining(training);
    message.info(`Viendo detalles de: ${training.title}`);
  };

  const handleEnroll = (training) => {
    Modal.confirm({
      title: 'Confirmar inscripción',
      content: `¿Desea inscribirse en "${training.title}"?`,
      onOk: async () => {
        try {
          // Aquí deberías obtener el userId del usuario actual
          const userId = JSON.parse(localStorage.getItem('user'))?.id || 1;
          await enrollMutation.mutateAsync({ id: training.id, userId });
          message.success(`Inscrito exitosamente en ${training.title}`);
          refetch();
        } catch (error) {
          message.error(error.response?.data?.message || 'Error al inscribirse');
        }
      },
    });
  };

  return (
    <div className="training-page" style={{ padding: '24px' }}>
      {/* Estadísticas rápidas */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Total Capacitaciones" 
              value={stats.total || 0} 
              prefix={<BookOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Inscripciones Totales" 
              value={stats.totalEnrollments || 0} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#1890ff' }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Competencia Promedio" 
              value={stats.avgCompetency || 0} 
              suffix="%" 
              prefix={<TrophyOutlined />} 
              valueStyle={{ color: '#52c41a' }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Próximas Capacitaciones" 
              value={stats.upcoming || 0} 
              prefix={<CalendarOutlined />} 
              valueStyle={{ color: '#faad14' }}
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Gestión de Capacitación</h1>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { 
              setSelectedTraining(null); 
              setModalVisible(true); 
            }}
          >
            Programar Capacitación
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spin size="large" /></div>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane 
              tab={<span><BookOutlined /> Capacitaciones ({trainings.length})</span>} 
              key="list"
            >
              <TrainingList 
                trainings={trainings} 
                loading={isLoading} 
                onEdit={(t) => { 
                  setSelectedTraining(t); 
                  setModalVisible(true); 
                }} 
                onDelete={handleDelete}
                onView={handleView}
                onEnroll={handleEnroll}
              />
            </TabPane>
            
            <TabPane 
              tab={<span><ProfileOutlined /> Matriz de Competencias</span>} 
              key="competency"
            >
              <CompetencyMatrix />
            </TabPane>
            
            <TabPane 
              tab={<span><CalendarOutlined /> Calendario</span>} 
              key="calendar"
            >
              <TrainingCalendar trainings={trainings} />
            </TabPane>
          </Tabs>
        )}
      </Card>

      {/* Modal para crear/editar capacitación */}
      <TrainingForm 
        visible={modalVisible} 
        onClose={() => { 
          setModalVisible(false); 
          setSelectedTraining(null); 
        }} 
        onSubmit={selectedTraining ? handleUpdate : handleCreate} 
        training={selectedTraining} 
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default TrainingPage;