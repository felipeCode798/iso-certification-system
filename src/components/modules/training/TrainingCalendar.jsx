// src/components/modules/training/TrainingCalendar.jsx
import React, { useState } from 'react';
import { Card, Calendar, Badge, Modal, List, Tag, Button, Empty } from 'antd';
import dayjs from 'dayjs';

const TrainingCalendar = ({ trainings = [] }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getTypeColor = (type) => {
    const colors = { internal: 'blue', external: 'purple', workshop: 'green' };
    return colors[type] || 'default';
  };

  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayTrainings = trainings.filter(t => t.date === dateStr);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayTrainings.map(t => (
          <li key={t.id} style={{ marginTop: 4 }}>
            <Badge 
              status="processing" 
              text={t.title} 
              color={getTypeColor(t.type)} 
              style={{ fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}
            />
          </li>
        ))}
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
                <Tag color={getTypeColor(item.type)}>{item.type?.toUpperCase()}</Tag>,
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