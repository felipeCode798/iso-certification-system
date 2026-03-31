// src/components/common/Cards/StatusCard.jsx
import React from 'react';
import { Card, Tag, Progress, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';

const StatusCard = ({ title, status, percentage, description, onAction, actionText }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return { icon: <CheckCircleOutlined className="text-green-500 text-2xl" />, color: '#52c41a' };
      case 'warning':
        return { icon: <WarningOutlined className="text-yellow-500 text-2xl" />, color: '#faad14' };
      case 'error':
        return { icon: <CloseCircleOutlined className="text-red-500 text-2xl" />, color: '#f5222d' };
      default:
        return { icon: null, color: '#1890ff' };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className="h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
        </div>
        {config.icon}
      </div>
      
      {percentage !== undefined && (
        <Progress percent={percentage} strokeColor={config.color} />
      )}
      
      {status && (
        <div className="mt-3">
          <Tag color={config.color} className="text-sm">
            {status.toUpperCase()}
          </Tag>
        </div>
      )}
      
      {onAction && (
        <Button type="primary" onClick={onAction} className="mt-4" block>
          {actionText || 'Ver detalles'}
        </Button>
      )}
    </Card>
  );
};

export default StatusCard;