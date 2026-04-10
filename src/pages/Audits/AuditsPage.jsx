// src/pages/Audits/AuditsPage.jsx
import React, { useState } from 'react';
import { Tabs, Button, message, Empty, Spin, Card, Row, Col, Statistic } from 'antd';
import { 
  PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, 
  WarningOutlined, FileTextOutlined, UnorderedListOutlined,
  CalendarOutlined, ProfileOutlined 
} from '@ant-design/icons';
import AuditList from '../../components/modules/audits/AuditList';
import AuditForm from '../../components/modules/audits/AuditForm';
import AuditPlan from '../../components/modules/audits/AuditPlan';
import AuditChecklist from '../../components/modules/audits/AuditChecklist';
import AuditReport from '../../components/modules/audits/AuditReport';
import {
  useGetAuditsQuery,
  useCreateAuditMutation,
  useUpdateAuditMutation,
  useDeleteAuditMutation,
} from '../../services/api/auditsService';

const { TabPane } = Tabs;

const AuditsPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [findings, setFindings] = useState([]);

  const { data: auditsData, isLoading, refetch } = useGetAuditsQuery();
  const createMutation = useCreateAuditMutation();
  const updateMutation = useUpdateAuditMutation();
  const deleteMutation = useDeleteAuditMutation();
  
  // Extraer datos de la respuesta
  const audits = auditsData?.data || auditsData || [];

  const handleCreate = async (values) => {
    try {
      await createMutation.mutateAsync(values);
      message.success('Auditoría creada exitosamente');
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
      message.success('Auditoría actualizada');
      setModalVisible(false);
      setSelectedAudit(null);
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al actualizar');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Auditoría eliminada');
      refetch();
      if (selectedAudit?.id === id) {
        setSelectedAudit(null);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleView = (audit) => {
    setSelectedAudit(audit);
    setActiveTab('plan');
  };

  const handleSaveChecklist = async (checklist) => {
    console.log('Checklist guardado:', checklist);
    message.success('Lista de verificación guardada');
    refetch();
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
      {/* Estadísticas rápidas */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Total Auditorías" 
              value={stats.total} 
              prefix={<FileTextOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Planificadas" 
              value={stats.planned} 
              prefix={<ClockCircleOutlined />} 
              valueStyle={{ color: '#1890ff' }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="En Progreso" 
              value={stats.inProgress} 
              prefix={<WarningOutlined />} 
              valueStyle={{ color: '#faad14' }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Completadas" 
              value={stats.completed} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#52c41a' }}
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Gestión de Auditorías</h1>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { 
              setSelectedAudit(null); 
              setModalVisible(true); 
            }}
          >
            Nueva Auditoría
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spin size="large" /></div>
        ) : audits.length === 0 ? (
          <Empty description="No hay auditorías registradas" />
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane 
              tab={<span><UnorderedListOutlined /> Lista de Auditorías ({audits.length})</span>} 
              key="list"
            >
              <AuditList 
                audits={audits} 
                loading={isLoading} 
                onView={handleView} 
                onEdit={(a) => { 
                  setSelectedAudit(a); 
                  setModalVisible(true); 
                }} 
                onDelete={handleDelete} 
                onViewReport={(a) => {
                  setSelectedAudit(a);
                  setActiveTab('report');
                }}
              />
            </TabPane>
            
            <TabPane 
              tab={<span><CalendarOutlined /> Plan de Auditoría</span>} 
              key="plan"
            >
              {selectedAudit ? (
                <AuditPlan 
                  audit={selectedAudit} 
                  onUpdate={handleUpdate} 
                />
              ) : (
                <Empty description="Seleccione una auditoría de la lista" />
              )}
            </TabPane>
            
            <TabPane 
              tab={<span><ProfileOutlined /> Lista de Verificación</span>} 
              key="checklist"
            >
              {selectedAudit ? (
                <AuditChecklist 
                  auditId={selectedAudit.id} 
                  checklist={selectedAudit.checklistItems || []} 
                  onSave={handleSaveChecklist} 
                />
              ) : (
                <Empty description="Seleccione una auditoría de la lista" />
              )}
            </TabPane>
            
            <TabPane 
              tab={<span><FileTextOutlined /> Informe</span>} 
              key="report"
            >
              {selectedAudit ? (
                <AuditReport 
                  audit={selectedAudit} 
                  findings={selectedAudit.findings || findings} 
                  checklist={selectedAudit.checklistItems || []}
                />
              ) : (
                <Empty description="Seleccione una auditoría de la lista" />
              )}
            </TabPane>
          </Tabs>
        )}
      </Card>

      {/* Modal para crear/editar auditoría */}
      <AuditForm 
        visible={modalVisible} 
        onClose={() => { 
          setModalVisible(false); 
          setSelectedAudit(null); 
        }} 
        onSubmit={selectedAudit ? handleUpdate : handleCreate} 
        audit={selectedAudit} 
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default AuditsPage;