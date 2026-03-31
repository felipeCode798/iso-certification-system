// src/components/modules/training/TrainingForm.jsx
import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, TimePicker } from 'antd';
import dayjs from 'dayjs';
import FormModal from '../../common/Modals/FormModal';

const { TextArea } = Input;

const TrainingForm = ({ visible, onClose, onSubmit, training = null }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const trainingData = { ...values, date: values.date?.format('YYYY-MM-DD'), time: values.time?.format('HH:mm'), id: training?.id };
    await onSubmit(trainingData);
    form.resetFields();
  };

  return (
    <FormModal visible={visible} onCancel={onClose} onSubmit={handleSubmit} title={training ? 'Editar Capacitación' : 'Programar Capacitación'} width={600}>
      <Form.Item name="title" label="Título" rules={[{ required: true }]} initialValue={training?.title}>
        <Input placeholder="Ej: Curso de Auditoría Interna" />
      </Form.Item>
      <Form.Item name="type" label="Tipo" rules={[{ required: true }]} initialValue={training?.type}>
        <Select><Select.Option value="internal">Interna</Select.Option><Select.Option value="external">Externa</Select.Option><Select.Option value="workshop">Taller</Select.Option></Select>
      </Form.Item>
      <Form.Item name="standard" label="Norma" initialValue={training?.standard}>
        <Select><Select.Option value="iso9001">ISO 9001</Select.Option><Select.Option value="iso27001">ISO 27001</Select.Option><Select.Option value="iso20000">ISO 20000</Select.Option></Select>
      </Form.Item>
      <Form.Item name="instructor" label="Instructor" rules={[{ required: true }]} initialValue={training?.instructor}>
        <Input placeholder="Nombre del instructor" />
      </Form.Item>
      <Form.Item name="date" label="Fecha" rules={[{ required: true }]} initialValue={training?.date ? dayjs(training.date) : null}>
        <DatePicker className="w-full" format="DD/MM/YYYY" />
      </Form.Item>
      <Form.Item name="time" label="Hora" initialValue={training?.time ? dayjs(training.time, 'HH:mm') : null}>
        <TimePicker className="w-full" format="HH:mm" />
      </Form.Item>
      <Form.Item name="duration" label="Duración (horas)" initialValue={training?.duration || 8}>
        <InputNumber min={1} max={40} className="w-full" />
      </Form.Item>
      <Form.Item name="capacity" label="Capacidad máxima" initialValue={training?.capacity || 20}>
        <InputNumber min={1} max={100} className="w-full" />
      </Form.Item>
      <Form.Item name="description" label="Descripción" initialValue={training?.description}>
        <TextArea rows={3} placeholder="Contenido y objetivos de la capacitación" />
      </Form.Item>
      <Form.Item name="prerequisites" label="Requisitos previos" initialValue={training?.prerequisites}>
        <Input placeholder="Conocimientos necesarios" />
      </Form.Item>
    </FormModal>
  );
};

export default TrainingForm;