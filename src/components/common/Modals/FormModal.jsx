// src/components/common/Modals/FormModal.jsx
import React from 'react';
import { Modal, Form, Button, Space } from 'antd';

const FormModal = ({ visible, onCancel, onSubmit, title, children, loading = false, width = 600 }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      width={width}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {children}
        <Form.Item className="mb-0 mt-4">
          <Space className="w-full justify-end">
            <Button onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Guardar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormModal;