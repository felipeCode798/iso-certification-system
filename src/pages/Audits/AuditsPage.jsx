// src/pages/Audits/AuditsPage.jsx
import React, { useState } from 'react';
import { Tabs, Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AuditList from '../../components/modules/audits/AuditList';
import AuditForm from '../../components/modules/audits/AuditForm';
import AuditPlan from '../../components/modules/audits/AuditPlan';
import AuditChecklist from '../../components/modules/audits/AuditChecklist';
import AuditReport from '../../components/modules/audits/AuditReport';

const { TabPane } = Tabs;

const AuditsPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);

  const handleEdit = (audit) => { setSelectedAudit(audit); setModalVisible(true); };
  const handleDelete = (id) => { message.success('Auditoría eliminada'); };
  const handleSubmit = (values) => { message.success('Auditoría guardada'); setModalVisible(false); setSelectedAudit(null); };

  return (
    <div className="audits-page">
      <div className="flex justify-between mb-4"><h1 className="text-2xl font-bold">Gestión de Auditorías</h1><Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedAudit(null); setModalVisible(true); }}>Nueva Auditoría</Button></div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Lista de Auditorías" key="list"><AuditList onEdit={handleEdit} onDelete={handleDelete} onView={(a) => { setSelectedAudit(a); setActiveTab('plan'); }} /></TabPane>
        <TabPane tab="Plan de Auditoría" key="plan">{selectedAudit && <AuditPlan audit={selectedAudit} />}</TabPane>
        <TabPane tab="Lista de Verificación" key="checklist">{selectedAudit && <AuditChecklist auditId={selectedAudit.id} />}</TabPane>
        <TabPane tab="Informe" key="report">{selectedAudit && <AuditReport audit={selectedAudit} />}</TabPane>
      </Tabs>
      <AuditForm visible={modalVisible} onClose={() => { setModalVisible(false); setSelectedAudit(null); }} onSubmit={handleSubmit} audit={selectedAudit} />
    </div>
  );
};

export default AuditsPage;