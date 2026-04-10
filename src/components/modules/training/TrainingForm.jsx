// src/components/modules/training/TrainingForm.jsx
import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import FormModal from '../../common/Modals/FormModal';

const { TextArea } = Input;

const TrainingForm = ({ visible, onClose, onSubmit, training = null, loading = false }) => {
  const [form] = FormModal.useForm();

  useEffect(() => {
    if (visible && training) {
      form.setFieldsValue({
        title: training.title,
        type: training.type,
        standard: training.standard,
        instructor: training.instructor,
        date: training.date ? dayjs(training.date) : null,
        time: training.time ? dayjs(training.time, 'HH:mm') : null,
        duration: training.duration,
        capacity: training.capacity,
        description: training.description,
        prerequisites: training.prerequisites,
        location: training.location,
        materials: training.materials,
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({
        duration: 8,
        capacity: 20,
      });
    }
  }, [visible, training, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        date: values.date?.format('YYYY-MM-DD'),
        time: values.time?.format('HH:mm'),
        ...(training?.id && { id: training.id }),
      };
      
      console.log('📤 Enviando capacitación:', JSON.stringify(payload, null, 2));
      await onSubmit(payload);
      form.resetFields();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  return (
    <FormModal
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onSubmit={handleSubmit}
      title={training ? 'Editar Capacitación' : 'Programar Capacitación'}
      width={600}
      loading={loading}
      form={form}
    >
      <FormModal.Item 
        name="title" 
        label="Título" 
        rules={[{ required: true, message: 'El título es requerido' }]}
      >
        <Input placeholder="Ej: Curso de Auditoría Interna" />
      </FormModal.Item>
      
      <FormModal.Item 
        name="type" 
        label="Tipo" 
        rules={[{ required: true, message: 'El tipo es requerido' }]}
      >
        <Select placeholder="Seleccione">
          <Select.Option value="internal">Interna</Select.Option>
          <Select.Option value="external">Externa</Select.Option>
          <Select.Option value="workshop">Taller</Select.Option>
        </Select>
      </FormModal.Item>
      
      <FormModal.Item name="standard" label="Norma">
        <Select placeholder="Seleccione (opcional)" allowClear>
          <Select.Option value="iso9001">ISO 9001 - Calidad</Select.Option>
          <Select.Option value="iso27001">ISO 27001 - Seguridad</Select.Option>
          <Select.Option value="iso20000">ISO 20000 - Servicios TI</Select.Option>
        </Select>
      </FormModal.Item>
      
      <FormModal.Item 
        name="instructor" 
        label="Instructor" 
        rules={[{ required: true, message: 'El instructor es requerido' }]}
      >
        <Input placeholder="Nombre del instructor" />
      </FormModal.Item>
      
      <FormModal.Item 
        name="date" 
        label="Fecha" 
        rules={[{ required: true, message: 'La fecha es requerida' }]}
      >
        <DatePicker className="w-full" format="DD/MM/YYYY" />
      </FormModal.Item>
      
      <FormModal.Item name="time" label="Hora">
        <TimePicker className="w-full" format="HH:mm" />
      </FormModal.Item>
      
      <FormModal.Item name="duration" label="Duración (horas)">
        <InputNumber min={1} max={40} className="w-full" />
      </FormModal.Item>
      
      <FormModal.Item name="capacity" label="Capacidad máxima">
        <InputNumber min={1} max={100} className="w-full" />
      </FormModal.Item>
      
      <FormModal.Item name="location" label="Ubicación">
        <Input placeholder="Sala, aula virtual, etc." />
      </FormModal.Item>
      
      <FormModal.Item name="description" label="Descripción">
        <TextArea rows={3} placeholder="Contenido y objetivos de la capacitación" />
      </FormModal.Item>
      
      <FormModal.Item name="prerequisites" label="Requisitos previos">
        <Input placeholder="Conocimientos necesarios" />
      </FormModal.Item>
      
      <FormModal.Item name="materials" label="Materiales">
        <Input placeholder="Materiales requeridos" />
      </FormModal.Item>
    </FormModal>
  );
};

export default TrainingForm;