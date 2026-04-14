// src/pages/Indicators/IndicatorsPage.jsx
import React, { useState } from 'react';
import { Tabs, message, Spin, Card, Row, Col, Statistic } from 'antd';
import { DashboardOutlined, UnorderedListOutlined, FileTextOutlined } from '@ant-design/icons';
import KPIDashboard from '../../components/modules/indicators/KPIDashboard';
import KPIDefinition from '../../components/modules/indicators/KPIDefinition';
import KPIReports from '../../components/modules/indicators/KPIReports';
import { useGetKPIsQuery, useGetDashboardQuery, useGetStatisticsQuery } from '../../services/api/indicatorsService';

const { TabPane } = Tabs;

const IndicatorsPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const { data: kpisData, isLoading: kpisLoading, refetch: refetchKPIs } = useGetKPIsQuery();
  const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = useGetDashboardQuery();
  const { data: statsData, isLoading: statsLoading } = useGetStatisticsQuery();
  
  const kpis = kpisData?.data || kpisData || [];
  const dashboard = dashboardData?.data || dashboardData || { summary: { total: 0, green: 0, yellow: 0, red: 0 }, compliance: {} };
  const stats = statsData?.data || statsData || { total: 0, active: 0, byFrequency: {}, totalValues: 0 };
  
  const isLoading = kpisLoading || dashboardLoading || statsLoading;

  return (
    <div className="indicators-page" style={{ padding: '24px' }}>
      {/* Estadísticas rápidas */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Total KPIs" 
              value={stats.total || 0} 
              prefix={<DashboardOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="KPIs Activos" 
              value={stats.active || 0} 
              valueStyle={{ color: '#52c41a' }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="En Verde" 
              value={dashboard.summary?.green || 0} 
              valueStyle={{ color: '#52c41a' }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic 
              title="Registros" 
              value={stats.totalValues || 0} 
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spin size="large" /></div>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane 
              tab={<span><DashboardOutlined /> Dashboard</span>} 
              key="dashboard"
            >
              <KPIDashboard />
            </TabPane>
            
            <TabPane 
              tab={<span><UnorderedListOutlined /> Definición de KPIs</span>} 
              key="definition"
            >
              <KPIDefinition />
            </TabPane>
            
            <TabPane 
              tab={<span><FileTextOutlined /> Reportes</span>} 
              key="reports"
            >
              <KPIReports />
            </TabPane>
          </Tabs>
        )}
      </Card>
    </div>
  );
};

export default IndicatorsPage;