// src/components/modules/training/CompetencyMatrix.jsx
import React from 'react';
import { Card, Table, Tag, Progress, Badge, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const CompetencyMatrix = () => {
  const data = [
    { employee: 'Juan Pérez', position: 'Auditor Líder', competencies: { iso9001: 90, iso27001: 85, iso20000: 75, leadership: 88, audit: 92 }, overall: 86 },
    { employee: 'María López', position: 'Coordinador de Calidad', competencies: { iso9001: 95, iso27001: 70, iso20000: 80, leadership: 85, audit: 88 }, overall: 83.6 },
    { employee: 'Carlos Ruiz', position: 'Auditor Interno', competencies: { iso9001: 85, iso27001: 80, iso20000: 70, leadership: 75, audit: 90 }, overall: 80 },
  ];

  const competencyLabels = { iso9001: 'ISO 9001', iso27001: 'ISO 27001', iso20000: 'ISO 20000', leadership: 'Liderazgo', audit: 'Auditoría' };
  const targetLevel = 80;

  const columns = [
    { title: 'Empleado', dataIndex: 'employee', key: 'employee' },
    { title: 'Cargo', dataIndex: 'position', key: 'position' },
    ...Object.keys(competencyLabels).map(key => ({
      title: <Tooltip title={competencyLabels[key]}>{competencyLabels[key]}</Tooltip>,
      dataIndex: ['competencies', key],
      key: key,
      render: (value) => (
        <div>
          <Progress percent={value} size="small" strokeColor={value >= targetLevel ? '#52c41a' : '#faad14'} />
          {value >= targetLevel ? <CheckCircleOutlined className="text-green-500" /> : <CloseCircleOutlined className="text-orange-500" />}
        </div>
      ),
    })),
    { title: 'Promedio', dataIndex: 'overall', key: 'overall', render: (val) => <Badge count={val.toFixed(0)} showZero color={val >= targetLevel ? '#52c41a' : '#faad14'} /> },
  ];

  const gaps = [
    { competency: 'ISO 27001', gap: 15, affected: ['María López', 'Carlos Ruiz'], priority: 'Alta' },
    { competency: 'ISO 20000', gap: 10, affected: ['Juan Pérez', 'Carlos Ruiz'], priority: 'Media' },
  ];

  return (
    <Card title="Matriz de Competencias">
      <Table columns={columns} dataSource={data} rowKey="employee" pagination={false} />
      <div className="mt-6">
        <h4 className="font-semibold mb-2">Brechas de Competencia Detectadas</h4>
        <Table dataSource={gaps} rowKey="competency" columns={[
          { title: 'Competencia', dataIndex: 'competency', key: 'competency' },
          { title: 'Brecha (%)', dataIndex: 'gap', key: 'gap', render: (val) => <Tag color="red">{val}%</Tag> },
          { title: 'Empleados Afectados', dataIndex: 'affected', key: 'affected', render: (val) => val.join(', ') },
          { title: 'Prioridad', dataIndex: 'priority', key: 'priority', render: (val) => <Tag color={val === 'Alta' ? 'red' : 'orange'}>{val}</Tag> },
        ]} pagination={false} />
      </div>
    </Card>
  );
};

export default CompetencyMatrix;