// src/pages/NonConformities/NonConformitiesPage.jsx
import React, { useState, useEffect } from 'react';
import { Tabs, Button, message, Modal, Empty, Spin, Card, Row, Col, Statistic, Tag, Space } from 'antd';
import { PlusOutlined, WarningOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import NCList from '../../components/modules/nonconformities/NCList';
import NCForm from '../../components/modules/nonconformities/NCForm';
import NCAnalysis from '../../components/modules/nonconformities/NCAnalysis';
import NCFollowUp from '../../components/modules/nonconformities/NCFollowUp';
import { mockNCs } from '../../utils/mockData';

const { TabPane } = Tabs;

const NonConformitiesPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNC, setSelectedNC] = useState(null);
  const [ncs, setNcs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNCs();
  }, []);

  const loadNCs = () => {
    setLoading(true);
    setTimeout(() => {
      setNcs(mockNCs);
      setLoading(false);
    }, 500);
  };

  const handleCreate = (values) => {
    const newNC = {
      ...values,
      id: ncs.length + 1,
      status: 'open',
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    setNcs([newNC, ...ncs]);
    message.success('No conformidad registrada exitosamente');
    setModalVisible(false);
  };

  const handleUpdate = (values) => {
    const updatedNCs = ncs.map(nc => nc.id === values.id ? { ...nc, ...values } : nc);
    setNcs(updatedNCs);
    message.success('No conformidad actualizada');
    setModalVisible(false);
    setSelectedNC(null);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '¿Eliminar no conformidad?',
      content: 'Esta acción no se puede deshacer',
      onOk: () => {
        setNcs(ncs.filter(nc => nc.id !== id));
        message.success('No conformidad eliminada');
      },
    });
  };

  const handleView = (nc) => {
    setSelectedNC(nc);
    setActiveTab('analysis');
  };

  const getStats = () => {
    const total = ncs.length;
    const open = ncs.filter(nc => nc.status === 'open').length;
    const inAnalysis = ncs.filter(nc => nc.status === 'inAnalysis').length;
    const closed = ncs.filter(nc => nc.status === 'closed').length;
    const critical = ncs.filter(nc => nc.severity === 'critical').length;
    return { total, open, inAnalysis, closed, critical };
  };

  const stats = getStats();

  return (
    <div className="nonconformities-page" style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic title="Total No Conformidades" value={stats.total} prefix={<ExclamationCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Abiertas" value={stats.open} prefix={<WarningOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="En Análisis" value={stats.inAnalysis} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Cerradas" value={stats.closed} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Gestión de No Conformidades</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedNC(null); setModalVisible(true); }}>
            Registrar No Conformidad
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spin size="large" /></div>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={`No Conformidades (${ncs.length})`} key="list">
              <NCList 
                ncs={ncs} 
                loading={loading} 
                onEdit={(nc) => { setSelectedNC(nc); setModalVisible(true); }} 
                onDelete={handleDelete}
                onView={handleView}
              />
            </TabPane>
            <TabPane tab="Registrar NC" key="register">
              <div className="p-4">
                <NCForm 
                  visible={modalVisible} 
                  onClose={() => { setModalVisible(false); setSelectedNC(null); }} 
                  onSubmit={selectedNC ? handleUpdate : handleCreate} 
                  nc={selectedNC} 
                />
                {!modalVisible && (
                  <div className="text-center py-8">
                    <p>Haga clic en "Registrar No Conformidad" para crear una nueva</p>
                    <Button type="primary" onClick={() => setModalVisible(true)}>Registrar No Conformidad</Button>
                  </div>
                )}
              </div>
            </TabPane>
            <TabPane tab="Análisis Causa Raíz" key="analysis">
              {selectedNC ? (
                <NCAnalysis 
                  visible={true} 
                  onClose={() => setSelectedNC(null)} 
                  nc={selectedNC}
                  onSave={(analysis) => {
                    const updatedNCs = ncs.map(nc => 
                      nc.id === selectedNC.id ? { ...nc, status: 'action', analysis } : nc
                    );
                    setNcs(updatedNCs);
                    message.success('Análisis guardado');
                  }}
                />
              ) : (
                <Empty description="Seleccione una no conformidad de la lista para analizar" />
              )}
            </TabPane>
            <TabPane tab="Seguimiento" key="followup">
              <NCFollowUp ncs={ncs} onUpdate={setNcs} />
            </TabPane>
          </Tabs>
        )}
      </Card>

      <NCForm 
        visible={modalVisible} 
        onClose={() => { setModalVisible(false); setSelectedNC(null); }} 
        onSubmit={selectedNC ? handleUpdate : handleCreate} 
        nc={selectedNC} 
      />
    </div>
  );
};

export default NonConformitiesPage;