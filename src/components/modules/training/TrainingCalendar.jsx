// src/components/modules/training/TrainingCalendar.jsx
import React, { useState } from 'react';
import { Card, Calendar, Badge, Modal, List, Tag, Button, Empty, Spin } from 'antd';
import dayjs from 'dayjs';

const TrainingCalendar = ({ trainings = [], loading = false }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getTypeColor = (type) => {
    const colors = { internal: 'blue', external: 'purple', workshop: 'green' };
    return colors[type] || 'default';
  };

  const getTypeLabel = (type) => {
    const labels = { internal: 'Interna', external: 'Externa', workshop: 'Taller' };
    return labels[type] || type;
  };

  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayTrainings = trainings.filter(t => t.date === dateStr);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayTrainings.slice(0, 3).map(t => (
          <li key={t.id} style={{ marginTop: 4 }}>
            <Badge 
              status="processing" 
              text={t.title.length > 20 ? t.title.substring(0, 20) + '...' : t.title} 
              color={getTypeColor(t.type)} 
              style={{ fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}
            />
          </li>
        ))}
        {dayTrainings.length > 3 && (
          <li style={{ marginTop: 4, fontSize: 11, color: '#999' }}>
            +{dayTrainings.length - 3} más
          </li>
        )}
      </ul>
    );
  };

  const handleSelect = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayTrainings = trainings.filter(t => t.date === dateStr);
    if (dayTrainings.length > 0) {
      setSelectedDate({ date: dateStr, trainings: dayTrainings });
      setModalVisible(true);
    }
  };

  if (loading) {
    return (
      <Card title="Calendario de Capacitaciones">
        <div className="text-center py-12">
          <Spin size="large" />
          <p className="mt-4">Cargando calendario...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Calendario de Capacitaciones">
      {trainings.length === 0 ? (
        <Empty description="No hay capacitaciones programadas" />
      ) : (
        <Calendar 
          dateCellRender={dateCellRender} 
          onSelect={handleSelect}
          style={{ padding: 8 }}
        />
      )}
      
      <Modal 
        title={`Capacitaciones - ${selectedDate?.date}`} 
        open={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        footer={null}
        width={500}
      >
        <List 
          dataSource={selectedDate?.trainings} 
          renderItem={item => (
            <List.Item 
              actions={[
                <Tag color={getTypeColor(item.type)}>{getTypeLabel(item.type)}</Tag>,
                <span>Duración: {item.duration}h</span>,
                <span>Inscritos: {item.enrolled || 0}/{item.capacity || 0}</span>
              ]}
            >
              <List.Item.Meta 
                title={<strong>{item.title}</strong>} 
                description={`Instructor: ${item.instructor}`}
              />
            </List.Item>
          )} 
        />
        <div className="mt-4 text-right">
          <Button type="primary" onClick={() => setModalVisible(false)}>
            Cerrar
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default TrainingCalendar;