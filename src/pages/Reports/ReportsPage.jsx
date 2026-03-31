// src/pages/Reports/ReportsPage.jsx
import React from 'react';
import { Card, Row, Col, Button, Select, DatePicker, Space, Table } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const ReportsPage = () => {
  const reportTypes = [
    { value: 'audit', label: 'Reporte de Auditorías' },
    { value: 'incident', label: 'Reporte de Incidentes' },
    { value: 'risk', label: 'Reporte de Riesgos' },
    { value: 'nc', label: 'Reporte de No Conformidades' },
    { value: 'kpi', label: 'Reporte de KPIs' },
  ];

  return (
    <div className="reports-page">
      <Card title="Generador de Reportes">
        <Row gutter={16}>
          <Col span={8}>
            <Select placeholder="Tipo de reporte" options={reportTypes} className="w-full" />
          </Col>
          <Col span={12}>
            <RangePicker className="w-full" />
          </Col>
          <Col span={4}>
            <Space>
              <Button type="primary" icon={<FilePdfOutlined />}>PDF</Button>
              <Button icon={<FileExcelOutlined />}>Excel</Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ReportsPage;