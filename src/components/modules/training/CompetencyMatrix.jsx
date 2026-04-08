// src/components/modules/training/CompetencyMatrix.jsx
import React from 'react';
import { Card, Table, Tag, Progress, Badge, Tooltip, Row, Col, Statistic } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, TrophyOutlined, TeamOutlined, WarningOutlined } from '@ant-design/icons';

const CompetencyMatrix = () => {
  const data = [
    { employee: 'Juan Pérez', position: 'Auditor Líder', department: 'Calidad', competencies: { iso9001: 90, iso27001: 85, iso20000: 75, leadership: 88, audit: 92 }, overall: 86 },
    { employee: 'María López', position: 'Coordinador de Calidad', department: 'Calidad', competencies: { iso9001: 95, iso27001: 70, iso20000: 80, leadership: 85, audit: 88 }, overall: 83.6 },
    { employee: 'Carlos Ruiz', position: 'Auditor Interno', department: 'Calidad', competencies: { iso9001: 85, iso27001: 80, iso20000: 70, leadership: 75, audit: 90 }, overall: 80 },
    { employee: 'Ana Martínez', position: 'Jefe de TI', department: 'Tecnología', competencies: { iso9001: 70, iso27001: 92, iso20000: 88, leadership: 82, audit: 75 }, overall: 81.4 },
    { employee: 'Luis Gómez', position: 'Coordinador de Seguridad', department: 'Seguridad', competencies: { iso9001: 75, iso27001: 88, iso20000: 78, leadership: 80, audit: 85 }, overall: 81.2 },
  ];

  const competencyLabels = { 
    iso9001: 'ISO 9001', 
    iso27001: 'ISO 27001', 
    iso20000: 'ISO 20000', 
    leadership: 'Liderazgo', 
    audit: 'Auditoría' 
  };
  
  const targetLevel = 80;

  const columns = [
    { title: 'Empleado', dataIndex: 'employee', key: 'employee', fixed: 'left', width: 150 },
    { title: 'Cargo', dataIndex: 'position', key: 'position', width: 180 },
    { title: 'Departamento', dataIndex: 'department', key: 'department', width: 120 },
    ...Object.keys(competencyLabels).map(key => ({
      title: <Tooltip title={competencyLabels[key]}>{competencyLabels[key]}</Tooltip>,
      dataIndex: ['competencies', key],
      key: key,
      width: 120,
      render: (value) => (
        <div>
          <Progress percent={value} size="small" strokeColor={value >= targetLevel ? '#52c41a' : '#faad14'} />
          <div className="text-center mt-1">
            {value >= targetLevel ? 
              <CheckCircleOutlined className="text-green-500" /> : 
              <CloseCircleOutlined className="text-orange-500" />
            }
            <span className="ml-1 text-xs">{value}%</span>
          </div>
        </div>
      ),
    })),
    { 
      title: 'Promedio', 
      dataIndex: 'overall', 
      key: 'overall', 
      width: 100,
      render: (val) => (
        <Badge 
          count={val.toFixed(0)} 
          showZero 
          color={val >= targetLevel ? '#52c41a' : '#faad14'} 
          style={{ fontSize: 14 }}
        />
      ) 
    },
  ];

  const getCompetencyGaps = () => {
    const gaps = [];
    data.forEach(employee => {
      Object.entries(employee.competencies).forEach(([comp, value]) => {
        if (value < targetLevel) {
          gaps.push({
            employee: employee.employee,
            competency: competencyLabels[comp],
            gap: targetLevel - value,
            priority: value < 70 ? 'Alta' : value < 75 ? 'Media' : 'Baja'
          });
        }
      });
    });
    return gaps;
  };

  const gaps = getCompetencyGaps();
  const totalEmployees = data.length;
  const avgCompetency = (data.reduce((sum, emp) => sum + emp.overall, 0) / totalEmployees).toFixed(1);
  const employeesBelowTarget = data.filter(emp => emp.overall < targetLevel).length;

  return (
    <Card title="Matriz de Competencias">
      <Row gutter={[16, 16]} className="mb-4">
        <Col span={8}>
          <Card size="small">
            <Statistic title="Promedio General" value={avgCompetency} suffix="%" prefix={<TrophyOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Total Empleados" value={totalEmployees} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Por Debajo del Target" value={employeesBelowTarget} prefix={<WarningOutlined />} valueStyle={{ color: employeesBelowTarget > 0 ? '#faad14' : '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="employee" 
        pagination={false}
        scroll={{ x: 1000 }}
        bordered
        size="middle"
      />
      
      {gaps.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Brechas de Competencia Detectadas</h4>
          <Table 
            dataSource={gaps} 
            rowKey={(record, index) => index}
            columns={[
              { title: 'Empleado', dataIndex: 'employee', key: 'employee' },
              { title: 'Competencia', dataIndex: 'competency', key: 'competency' },
              { title: 'Brecha (%)', dataIndex: 'gap', key: 'gap', render: (val) => <Tag color="red">{val}%</Tag> },
              { title: 'Prioridad', dataIndex: 'priority', key: 'priority', render: (val) => <Tag color={val === 'Alta' ? 'red' : val === 'Media' ? 'orange' : 'blue'}>{val}</Tag> },
            ]} 
            pagination={false} 
            size="small"
          />
          <div className="mt-4">
            <Button type="primary" danger={gaps.some(g => g.priority === 'Alta')}>
              Generar Plan de Capacitación
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CompetencyMatrix;