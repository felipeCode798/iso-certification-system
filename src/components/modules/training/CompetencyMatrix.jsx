// src/components/modules/training/CompetencyMatrix.jsx
import React from 'react';
import { Card, Table, Tag, Progress, Badge, Tooltip, Row, Col, Statistic, Button, Spin, Empty } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, TrophyOutlined, TeamOutlined, WarningOutlined } from '@ant-design/icons';
import { useGetCompetencyMatrixQuery, useGetCompetencyGapsQuery } from '../../../services/api/trainingService';

const CompetencyMatrix = () => {
  const { data: matrixData, isLoading: matrixLoading } = useGetCompetencyMatrixQuery();
  const { data: gapsData, isLoading: gapsLoading } = useGetCompetencyGapsQuery(80);
  
  const matrix = matrixData?.data || matrixData || [];
  const gaps = gapsData?.data || gapsData || [];
  
  const competencyLabels = { 
    iso9001: 'ISO 9001', 
    iso27001: 'ISO 27001', 
    iso20000: 'ISO 20000', 
  };
  
  const targetLevel = 80;
  
  // Obtener todas las competencias únicas
  const allCompetencies = ['iso9001', 'iso27001', 'iso20000'];
  
  const columns = [
    { title: 'Empleado', dataIndex: 'userName', key: 'userName', fixed: 'left', width: 150 },
    { title: 'Cargo', dataIndex: 'position', key: 'position', width: 180 },
    { title: 'Departamento', dataIndex: 'department', key: 'department', width: 120 },
    ...allCompetencies.map(key => ({
      title: <Tooltip title={competencyLabels[key]}>{competencyLabels[key]}</Tooltip>,
      dataIndex: ['competencies', key],
      key: key,
      width: 120,
      render: (value) => value ? (
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
      ) : <Tag>N/A</Tag>,
    })),
    { 
      title: 'Promedio', 
      dataIndex: 'overall', 
      key: 'overall', 
      width: 100,
      render: (val) => (
        <Badge 
          count={val?.toFixed(0)} 
          showZero 
          color={val >= targetLevel ? '#52c41a' : '#faad14'} 
          style={{ fontSize: 14 }}
        />
      ) 
    },
  ];
  
  const totalEmployees = matrix.length;
  const avgCompetency = totalEmployees > 0 
    ? (matrix.reduce((sum, emp) => sum + (emp.overall || 0), 0) / totalEmployees).toFixed(1) 
    : 0;
  const employeesBelowTarget = matrix.filter(emp => (emp.overall || 0) < targetLevel).length;
  
  if (matrixLoading || gapsLoading) {
    return (
      <Card title="Matriz de Competencias">
        <div className="text-center py-12">
          <Spin size="large" />
          <p className="mt-4">Cargando matriz de competencias...</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card title="Matriz de Competencias">
      <Row gutter={[16, 16]} className="mb-4">
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Promedio General" 
              value={avgCompetency} 
              suffix="%" 
              prefix={<TrophyOutlined />} 
              valueStyle={{ color: '#52c41a' }} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Total Empleados" 
              value={totalEmployees} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Por Debajo del Target" 
              value={employeesBelowTarget} 
              prefix={<WarningOutlined />} 
              valueStyle={{ color: employeesBelowTarget > 0 ? '#faad14' : '#52c41a' }} 
            />
          </Card>
        </Col>
      </Row>
      
      {matrix.length === 0 ? (
        <Empty description="No hay datos de competencias registrados" />
      ) : (
        <Table 
          columns={columns} 
          dataSource={matrix} 
          rowKey="userId" 
          pagination={false}
          scroll={{ x: 1000 }}
          bordered
          size="middle"
        />
      )}
      
      {gaps.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Brechas de Competencia Detectadas</h4>
          <Table 
            dataSource={gaps} 
            rowKey={(record, index) => index}
            columns={[
              { title: 'Empleado', dataIndex: 'userName', key: 'userName' },
              { title: 'Competencia', dataIndex: 'competency', key: 'competency', render: (val) => competencyLabels[val] || val },
              { title: 'Nivel Actual', dataIndex: 'currentLevel', key: 'currentLevel', render: (val) => `${val}%` },
              { title: 'Brecha (%)', dataIndex: 'gap', key: 'gap', render: (val) => <Tag color="red">{val}%</Tag> },
              { 
                title: 'Prioridad', 
                dataIndex: 'priority', 
                key: 'priority', 
                render: (val) => (
                  <Tag color={val === 'Alta' ? 'red' : val === 'Media' ? 'orange' : 'blue'}>
                    {val}
                  </Tag>
                )
              },
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