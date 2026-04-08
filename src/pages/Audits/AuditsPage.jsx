// src/pages/Audits/AuditsPage.jsx
import React, { useState, useEffect } from 'react';
import { Tabs, Button, message, Modal, Empty, Spin, Card, Row, Col, Statistic, Tag } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, FileTextOutlined } from '@ant-design/icons';
import AuditList from '../../components/modules/audits/AuditList';
import AuditForm from '../../components/modules/audits/AuditForm';
import AuditPlan from '../../components/modules/audits/AuditPlan';
import AuditChecklist from '../../components/modules/audits/AuditChecklist';
import AuditReport from '../../components/modules/audits/AuditReport';
import { mockAudits } from '../../utils/mockData';

const { TabPane } = Tabs;

const AuditsPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [findings, setFindings] = useState([]);

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = () => {
    setLoading(true);
    setTimeout(() => {
      setAudits(mockAudits);
      setLoading(false);
    }, 500);
  };

  const handleCreate = (values) => {
    const newAudit = {
      ...values,
      id: audits.length + 1,
      progress: 0,
      status: 'planned',
      createdAt: new Date().toISOString(),
    };
    setAudits([newAudit, ...audits]);
    message.success('Auditoría creada exitosamente');
    setModalVisible(false);
  };

  const handleUpdate = (values) => {
    const updatedAudits = audits.map(a => a.id === values.id ? { ...a, ...values } : a);
    setAudits(updatedAudits);
    message.success('Auditoría actualizada');
    setModalVisible(false);
    setSelectedAudit(null);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '¿Eliminar auditoría?',
      content: 'Esta acción no se puede deshacer',
      onOk: () => {
        setAudits(audits.filter(a => a.id !== id));
        message.success('Auditoría eliminada');
      },
    });
  };

  const handleView = (audit) => {
    setSelectedAudit(audit);
    setActiveTab('plan');
  };

  const handleSaveChecklist = (report) => {
    console.log('Checklist guardado:', report);
    message.success('Lista de verificación guardada');
  };

  const getStats = () => {
    const total = audits.length;
    const planned = audits.filter(a => a.status === 'planned').length;
    const inProgress = audits.filter(a => a.status === 'inProgress').length;
    const completed = audits.filter(a => a.status === 'completed').length;
    return { total, planned, inProgress, completed };
  };

  const stats = getStats();

  return (
    <div className="audits-page" style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}><Card><Statistic title="Total Auditorías" value={stats.total} prefix={<FileTextOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Planificadas" value={stats.planned} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="En Progreso" value={stats.inProgress} prefix={<WarningOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="Completadas" value={stats.completed} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Gestión de Auditorías</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedAudit(null); setModalVisible(true); }}>
            Nueva Auditoría
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spin size="large" /></div>
        ) : audits.length === 0 ? (
          <Empty description="No hay auditorías registradas" />
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={`Lista de Auditorías (${audits.length})`} key="list">
              <AuditList audits={audits} loading={loading} onView={handleView} onEdit={(a) => { setSelectedAudit(a); setModalVisible(true); }} onDelete={handleDelete} />
            </TabPane>
            <TabPane tab="Plan de Auditoría" key="plan">
              {selectedAudit ? <AuditPlan audit={selectedAudit} onUpdate={handleUpdate} /> : <Empty description="Seleccione una auditoría de la lista" />}
            </TabPane>
            <TabPane tab="Lista de Verificación" key="checklist">
              {selectedAudit ? <AuditChecklist auditId={selectedAudit.id} checklist={[]} onSave={handleSaveChecklist} /> : <Empty description="Seleccione una auditoría de la lista" />}
            </TabPane>
            <TabPane tab="Informe" key="report">
              {selectedAudit ? <AuditReport audit={selectedAudit} findings={findings} /> : <Empty description="Seleccione una auditoría de la lista" />}
            </TabPane>
          </Tabs>
        )}
      </Card>

      <AuditForm visible={modalVisible} onClose={() => { setModalVisible(false); setSelectedAudit(null); }} onSubmit={selectedAudit ? handleUpdate : handleCreate} audit={selectedAudit} />
    </div>
  );
};

export default AuditsPage;