// src/components/common/Modals/ConfirmModal.jsx
import React from 'react';
import { Modal, Button, Space, Typography } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ConfirmModal = ({ visible, onConfirm, onCancel, title, message, type = 'warning', loading = false }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined className="text-green-500 text-2xl" />;
      case 'error':
        return <CloseCircleOutlined className="text-red-500 text-2xl" />;
      default:
        return <ExclamationCircleOutlined className="text-yellow-500 text-2xl" />;
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
    >
      <div className="text-center">
        <div className="mb-4">{getIcon()}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <Text type="secondary">{message}</Text>
        <div className="mt-6">
          <Space>
            <Button onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="primary" danger={type === 'warning'} onClick={onConfirm} loading={loading}>
              Confirmar
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;