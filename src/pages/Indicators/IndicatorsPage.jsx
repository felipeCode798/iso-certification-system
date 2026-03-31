// src/pages/Indicators/IndicatorsPage.jsx
import React from 'react';
import { Tabs } from 'antd';
import KPIDashboard from '../../components/modules/indicators/KPIDashboard';
import KPIDefinition from '../../components/modules/indicators/KPIDefinition';
import KPIReports from '../../components/modules/indicators/KPIReports';

const { TabPane } = Tabs;

const IndicatorsPage = () => {
  return (
    <div className="indicators-page">
      <Tabs defaultActiveKey="dashboard">
        <TabPane tab="Dashboard" key="dashboard">
          <KPIDashboard />
        </TabPane>
        <TabPane tab="Definición de KPIs" key="definition">
          <KPIDefinition />
        </TabPane>
        <TabPane tab="Reportes" key="reports">
          <KPIReports />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default IndicatorsPage;