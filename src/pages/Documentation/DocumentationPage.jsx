// src/pages/Documentation/DocumentationPage.jsx
import React from 'react';
import { Tabs } from 'antd';
import DocumentList from '../../components/modules/documentation/DocumentList';
import VersionControl from '../../components/modules/documentation/VersionControl';

const { TabPane } = Tabs;

const DocumentationPage = () => {
  return (
    <div className="documentation-page">
      <Tabs defaultActiveKey="documents">
        <TabPane tab="Documentos" key="documents">
          <DocumentList />
        </TabPane>
        <TabPane tab="Control de Versiones" key="versions">
          <VersionControl />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DocumentationPage;