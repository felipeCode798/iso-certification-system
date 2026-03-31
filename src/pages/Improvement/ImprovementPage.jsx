// src/pages/Improvement/ImprovementPage.jsx
import React from 'react';
import { Tabs } from 'antd';
import ActionPlan from '../../components/modules/continuous-improvement/ActionPlan';
import CorrectiveActions from '../../components/modules/continuous-improvement/CorrectiveActions';
import PreventiveActions from '../../components/modules/continuous-improvement/PreventiveActions';
import ImprovementTracker from '../../components/modules/continuous-improvement/ImprovementTracker';

const { TabPane } = Tabs;

const ImprovementPage = () => {
  return (
    <div className="improvement-page">
      <Tabs defaultActiveKey="tracker">
        <TabPane tab="Seguimiento" key="tracker">
          <ImprovementTracker />
        </TabPane>
        <TabPane tab="Plan de Acción" key="plan">
          <ActionPlan />
        </TabPane>
        <TabPane tab="Acciones Correctivas" key="corrective">
          <CorrectiveActions />
        </TabPane>
        <TabPane tab="Acciones Preventivas" key="preventive">
          <PreventiveActions />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ImprovementPage;