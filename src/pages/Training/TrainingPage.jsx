// src/pages/Training/TrainingPage.jsx
import React from 'react';
import { Tabs } from 'antd';
import TrainingList from '../../components/modules/training/TrainingList';
import TrainingForm from '../../components/modules/training/TrainingForm';
import CompetencyMatrix from '../../components/modules/training/CompetencyMatrix';
import TrainingCalendar from '../../components/modules/training/TrainingCalendar';

const { TabPane } = Tabs;

const TrainingPage = () => {
  return (
    <div className="training-page">
      <Tabs defaultActiveKey="list">
        <TabPane tab="Capacitaciones" key="list">
          <TrainingList />
        </TabPane>
        <TabPane tab="Programar" key="schedule">
          <TrainingForm />
        </TabPane>
        <TabPane tab="Matriz de Competencias" key="competency">
          <CompetencyMatrix />
        </TabPane>
        <TabPane tab="Calendario" key="calendar">
          <TrainingCalendar />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TrainingPage;