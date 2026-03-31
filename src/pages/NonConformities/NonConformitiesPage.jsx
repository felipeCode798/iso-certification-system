// src/pages/NonConformities/NonConformitiesPage.jsx
import React from 'react';
import { Tabs } from 'antd';
import NCList from '../../components/modules/nonconformities/NCList';
import NCForm from '../../components/modules/nonconformities/NCForm';
import NCAnalysis from '../../components/modules/nonconformities/NCAnalysis';
import NCFollowUp from '../../components/modules/nonconformities/NCFollowUp';

const { TabPane } = Tabs;

const NonConformitiesPage = () => {
  return (
    <div className="nonconformities-page">
      <Tabs defaultActiveKey="list">
        <TabPane tab="No Conformidades" key="list">
          <NCList />
        </TabPane>
        <TabPane tab="Registrar NC" key="register">
          <NCForm />
        </TabPane>
        <TabPane tab="Análisis" key="analysis">
          <NCAnalysis />
        </TabPane>
        <TabPane tab="Seguimiento" key="followup">
          <NCFollowUp />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default NonConformitiesPage;