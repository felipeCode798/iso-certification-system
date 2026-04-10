// src/components/modules/audits/AuditPlan.jsx
import React, { useState } from 'react';
import { Card, Timeline, Button, Space, Tag, Descriptions, Modal, Form, Input, TimePicker, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;

const getDefaultActivities = (audit) => [
  { id: 1, time: '09:00', title: 'Reunión de Apertura', type: 'opening', location: 'Sala de Juntas', responsible: audit?.auditor || 'Auditor Líder', description: 'Presentación del equipo auditor, confirmación de alcance y cronograma' },
  { id: 2, time: '10:00', title: 'Revisión de Documentación', type: 'audit', location: 'Oficina de Calidad', responsible: audit?.auditor || 'Auditor Líder', description: 'Revisión de manuales, procedimientos y registros' },
  { id: 3, time: '11:30', title: 'Entrevista con Dirección', type: 'interview', location: 'Oficina Gerencia', responsible: audit?.auditor || 'Auditor Líder', description: 'Verificación de compromiso y liderazgo' },
  { id: 4, time: '14:00', title: 'Auditoría en Terreno', type: 'audit', location: 'Planta/Operaciones', responsible: audit?.auditTeam?.[0] || 'Equipo Auditor', description: 'Verificación de implementación en procesos operativos' },
  { id: 5, time: '16:30', title: 'Preparación de Hallazgos', type: 'review', location: 'Sala de Auditores', responsible: 'Equipo Auditor', description: 'Análisis de evidencias y preparación de hallazgos' },
  { id: 6, time: '17:30', title: 'Reunión de Cierre', type: 'closing', location: 'Sala de Juntas', responsible: audit?.auditor || 'Auditor Líder', description: 'Presentación de hallazgos y conclusiones preliminares' },
];

const AuditPlan = ({ audit, onUpdate }) => {
  const [activities, setActivities] = useState(() => audit?.activities || getDefaultActivities(audit));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [form] = Form.useForm();

  const getActivityColor = (type) => {
    const colors = { opening: 'green', audit: 'blue', interview: 'orange', review: 'purple', closing: 'red' };
    return colors[type] || 'gray';
  };

  const handleAddOrUpdate = (values) => {
    if (editingActivity) {
      const updated = activities.map(a => a.id === editingActivity.id ? { ...values, id: a.id, time: values.time?.format('HH:mm') || values.time } : a);
      setActivities(updated);
      message.success('Actividad actualizada');
    } else {
      const newActivity = { ...values, id: Date.now(), time: values.time?.format('HH:mm') || values.time };
      setActivities([...activities, newActivity]);
      message.success('Actividad agregada');
    }
    setIsModalVisible(false);
    setEditingActivity(null);
    form.resetFields();
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    form.setFieldsValue({ 
      ...activity, 
      time: activity.time ? dayjs(activity.time, 'HH:mm') : null 
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '¿Eliminar actividad?',
      content: 'Esta acción no se puede deshacer',
      onOk: () => {
        setActivities(activities.filter(a => a.id !== id));
        message.success('Actividad eliminada');
      },
    });
  };

  const handleExport = () => {
    const planText = activities.map(a => `${a.time} - ${a.title}: ${a.description} (${a.location}) - Responsable: ${a.responsible}`).join('\n\n');
    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Plan_Auditoria_${audit?.id || 'nueva'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('Plan exportado');
  };

  return (
    <Card
      title={`Plan de Auditoría - ${audit?.name || 'Nueva Auditoría'}`}
      extra={
        <Space>
          <Button icon={<CalendarOutlined />}>Ver Calendario</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>Exportar</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingActivity(null); form.resetFields(); setIsModalVisible(true); }}>
            Agregar Actividad
          </Button>
        </Space>
      }
    >
      <Descriptions bordered column={2} size="small" className="mb-6">
        <Descriptions.Item label="Código">{audit?.auditCode || 'No asignado'}</Descriptions.Item>
        <Descriptions.Item label="Tipo">{audit?.type?.toUpperCase() || 'No definido'}</Descriptions.Item>
        <Descriptions.Item label="Fecha">{audit?.auditDate || 'No definida'}</Descriptions.Item>
        <Descriptions.Item label="Auditor Líder">{audit?.auditor || 'No asignado'}</Descriptions.Item>
        <Descriptions.Item label="Alcance" span={2}>{audit?.scope || 'No definido'}</Descriptions.Item>
        <Descriptions.Item label="Objetivos" span={2}>{audit?.objectives || 'No definidos'}</Descriptions.Item>
      </Descriptions>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p>No hay actividades planificadas</p>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>Agregar primera actividad</Button>
        </div>
      ) : (
        <Timeline mode="left" className="mt-6">
          {activities.map((activity) => (
            <Timeline.Item key={activity.id} label={activity.time} color={getActivityColor(activity.type)}>
              <Card size="small" className="mb-2 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">{activity.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                    <Space size="small" wrap>
                      <Tag icon={<UserOutlined />} color="blue">{activity.responsible}</Tag>
                      <Tag color="geekblue">{activity.location}</Tag>
                      <Tag color={getActivityColor(activity.type)}>{activity.type?.toUpperCase()}</Tag>
                    </Space>
                  </div>
                  <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(activity)} />
                    <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(activity.id)} />
                  </Space>
                </div>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      )}

      <Modal 
        title={editingActivity ? 'Editar Actividad' : 'Nueva Actividad'} 
        open={isModalVisible} 
        onCancel={() => { 
          setIsModalVisible(false); 
          setEditingActivity(null); 
          form.resetFields(); 
        }} 
        footer={null} 
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrUpdate}>
          <Form.Item name="title" label="Título" rules={[{ required: true, message: 'Ingrese el título' }]}>
            <Input placeholder="Ej: Revisión de Documentación" />
          </Form.Item>
          
          <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
            <Select placeholder="Seleccione el tipo">
              <Select.Option value="opening">Apertura</Select.Option>
              <Select.Option value="audit">Auditoría</Select.Option>
              <Select.Option value="interview">Entrevista</Select.Option>
              <Select.Option value="review">Revisión</Select.Option>
              <Select.Option value="closing">Cierre</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="time" label="Hora" rules={[{ required: true }]}>
            <TimePicker className="w-full" format="HH:mm" />
          </Form.Item>
          
          <Form.Item name="location" label="Ubicación" rules={[{ required: true }]}>
            <Input placeholder="Ej: Sala de Juntas" />
          </Form.Item>
          
          <Form.Item name="responsible" label="Responsable" rules={[{ required: true }]}>
            <Input placeholder="Nombre del responsable" />
          </Form.Item>
          
          <Form.Item name="description" label="Descripción">
            <TextArea rows={3} placeholder="Describa las actividades a realizar" />
          </Form.Item>
          
          <Form.Item className="text-right">
            <Space>
              <Button onClick={() => { setIsModalVisible(false); setEditingActivity(null); form.resetFields(); }}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                {editingActivity ? 'Actualizar' : 'Agregar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AuditPlan;