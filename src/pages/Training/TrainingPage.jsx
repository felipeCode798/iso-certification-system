// src/pages/Training/TrainingPage.jsx
import React, { useState, useEffect } from 'react';
import { Tabs, Button, message, Modal, Empty, Spin, Card, Row, Col, Statistic, Tag, Space } from 'antd';
import { PlusOutlined, CalendarOutlined, TeamOutlined, BookOutlined, TrophyOutlined } from '@ant-design/icons';
import TrainingList from '../../components/modules/training/TrainingList';
import TrainingForm from '../../components/modules/training/TrainingForm';
import CompetencyMatrix from '../../components/modules/training/CompetencyMatrix';
import TrainingCalendar from '../../components/modules/training/TrainingCalendar';
import { mockTrainings } from '../../utils/mockData';

const { TabPane } = Tabs;

const TrainingPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = () => {
    setLoading(true);
    setTimeout(() => {
      setTrainings(mockTrainings);
      setLoading(false);
    }, 500);
  };

  const handleCreate = (values) => {
    const newTraining = {
      ...values,
      id: trainings.length + 1,
      enrolled: 0,
      status: 'planned',
      createdAt: new Date().toISOString(),
    };
    setTrainings([newTraining, ...trainings]);
    message.success('Capacitación programada exitosamente');
    setModalVisible(false);
  };

  const handleUpdate = (values) => {
    const updatedTrainings = trainings.map(t => t.id === values.id ? { ...t, ...values } : t);
    setTrainings(updatedTrainings);
    message.success('Capacitación actualizada');
    setModalVisible(false);
    setSelectedTraining(null);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '¿Eliminar capacitación?',
      content: 'Esta acción no se puede deshacer',
      onOk: () => {
        setTrainings(trainings.filter(t => t.id !== id));
        message.success('Capacitación eliminada');
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
      onOk: () => {
        const updatedTrainings = trainings.map(t => 
          t.id === training.id ? { ...t, enrolled: t.enrolled + 1 } : t
        );
        setTrainings(updatedTrainings);
        message.success(`Inscrito exitosamente en ${training.title}`);
      },
    });
  };

  const getStats = () => {
    const total = trainings.length;
    const totalEnrolled = trainings.reduce((sum, t) => sum + (t.enrolled || 0), 0);
    const averageAttendance = total > 0 ? (totalEnrolled / total).toFixed(1) : 0;
    const upcoming = trainings.filter(t => new Date(t.date) > new Date()).length;
    return { total, totalEnrolled, averageAttendance, upcoming };
  };

  const stats = getStats();

  return (
    <div className="training-page" style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic title="Total Capacitaciones" value={stats.total} prefix={<BookOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Inscripciones Totales" value={stats.totalEnrolled} prefix={<TeamOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Asistencia Promedio" value={stats.averageAttendance} suffix="por clase" prefix={<TrophyOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Próximas" value={stats.upcoming} prefix={<CalendarOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Gestión de Capacitación</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedTraining(null); setModalVisible(true); }}>
            Programar Capacitación
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spin size="large" /></div>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={`Capacitaciones (${trainings.length})`} key="list">
              <TrainingList 
                trainings={trainings} 
                loading={loading} 
                onEdit={(t) => { setSelectedTraining(t); setModalVisible(true); }} 
                onDelete={handleDelete}
                onView={handleView}
                onEnroll={handleEnroll}
              />
            </TabPane>
            <TabPane tab="Programar" key="schedule">
              <div className="p-4">
                <TrainingForm 
                  visible={modalVisible} 
                  onClose={() => { setModalVisible(false); setSelectedTraining(null); }} 
                  onSubmit={selectedTraining ? handleUpdate : handleCreate} 
                  training={selectedTraining} 
                />
                {!modalVisible && (
                  <div className="text-center py-8">
                    <p>Haga clic en "Programar Capacitación" para crear una nueva</p>
                    <Button type="primary" onClick={() => setModalVisible(true)}>Programar Capacitación</Button>
                  </div>
                )}
              </div>
            </TabPane>
            <TabPane tab="Matriz de Competencias" key="competency">
              <CompetencyMatrix />
            </TabPane>
            <TabPane tab="Calendario" key="calendar">
              <TrainingCalendar trainings={trainings} />
            </TabPane>
          </Tabs>
        )}
      </Card>

      <TrainingForm 
        visible={modalVisible} 
        onClose={() => { setModalVisible(false); setSelectedTraining(null); }} 
        onSubmit={selectedTraining ? handleUpdate : handleCreate} 
        training={selectedTraining} 
      />
    </div>
  );
};

export default TrainingPage;