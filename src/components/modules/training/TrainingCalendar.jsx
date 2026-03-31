// src/components/modules/training/TrainingCalendar.jsx
import React, { useState } from 'react';
import { Card, Calendar, Badge, Modal, List, Tag, Button, Space } from 'antd';

const TrainingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const trainings = [
    { date: '2024-02-15', title: 'Capacitación ISO 9001', type: 'internal', attendees: 12, duration: '4h' },
    { date: '2024-02-20', title: 'Auditoría Interna', type: 'workshop', attendees: 8, duration: '8h' },
    { date: '2024-02-25', title: 'Gestión de Riesgos', type: 'external', attendees: 5, duration: '8h' },
    { date: '2024-03-05', title: 'ISO 27001', type: 'internal', attendees: 15, duration: '8h' },
  ];

  const getTypeColor = (type) => {
    const colors = { internal: 'blue', external: 'purple', workshop: 'green' };
    return colors[type] || 'default';
  };

  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayTrainings = trainings.filter(t => t.date === dateStr);
    return (
      <ul className="events">
        {dayTrainings.map(t => (
          <li key={t.title}>
            <Badge status="processing" text={t.title} color={getTypeColor(t.type)} />
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
      <Calendar dateCellRender={dateCellRender} onSelect={handleSelect} />
      <Modal title={`Capacitaciones - ${selectedDate?.date}`} open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        <List dataSource={selectedDate?.trainings} renderItem={item => (
          <List.Item actions={[<Tag color={getTypeColor(item.type)}>{item.type.toUpperCase()}</Tag>, <span>Duración: {item.duration}</span>, <span>Asistentes: {item.attendees}</span>]}>
            <List.Item.Meta title={item.title} />
          </List.Item>
        )} />
        <div className="mt-4 text-right"><Button type="primary">Agregar al Calendario</Button></div>
      </Modal>
    </Card>
  );
};

export default TrainingCalendar;