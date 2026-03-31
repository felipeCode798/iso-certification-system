// src/components/common/Cards/MetricCard.jsx
import React from 'react';
import { Card, Statistic, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MetricCard = ({ title, value, icon, trend, color, suffix, prefix }) => {
  return (
    <Card className="metric-card" hoverable>
      <div className="flex justify-between items-start">
        <div>
          <Text type="secondary" className="text-sm">{title}</Text>
          <Statistic
            value={value}
            valueStyle={{ color: color, fontSize: '28px', fontWeight: 'bold' }}
            prefix={prefix}
            suffix={suffix}
          />
          {trend && (
            <div className="mt-2">
              <Text type={trend.isPositive ? 'success' : 'danger'} className="text-xs">
                {trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(trend.value)}% vs mes anterior
              </Text>
            </div>
          )}
        </div>
        <div className="text-3xl" style={{ color: color }}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;