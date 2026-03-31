import React, { useState } from 'react';
import { Table, Tag, Button, Space, Tooltip, Input, Modal, Descriptions, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';

const categoryLabels = {
  strategic:     { label: 'Estratégico',  color: 'purple' },
  operational:   { label: 'Operacional',  color: 'blue'   },
  financial:     { label: 'Financiero',   color: 'gold'   },
  technological: { label: 'Tecnológico',  color: 'cyan'   },
  legal:         { label: 'Legal',        color: 'orange' },
};

const getRiskLevel = (score) => {
  if (score >= 20) return { label: 'Extremo', color: 'error'  , tag: 'red'    };
  if (score >= 15) return { label: 'Alto',    color: 'warning', tag: 'orange' };
  if (score >= 8)  return { label: 'Medio',   color: 'default', tag: 'yellow' };
  return                  { label: 'Bajo',    color: 'success', tag: 'green'  };
};

const RiskList = ({ risks = [], loading, onEdit, onDelete, onNew }) => {
  const [search, setSearch]   = useState('');
  const [viewRisk, setViewRisk] = useState(null);

  const filtered = risks.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.responsible?.toLowerCase().includes(search.toLowerCase()) ||
    r.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (record) => {
    Modal.confirm({
      title: '¿Eliminar riesgo?',
      content: `Se eliminará "${record.name}" del registro.`,
      okText: 'Eliminar', okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: () => onDelete(record.id),
    });
  };

  const columns = [
    {
      title: 'Riesgo', dataIndex: 'name', key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, r) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-400">{r.responsible}</div>
        </div>
      ),
    },
    {
      title: 'Categoría', dataIndex: 'category', key: 'category', width: 130,
      render: cat => <Tag color={categoryLabels[cat]?.color}>{categoryLabels[cat]?.label || cat}</Tag>,
      filters: Object.entries(categoryLabels).map(([v, c]) => ({ text: c.label, value: v })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'P × I', key: 'score', width: 90,
      render: (_, r) => (
        <Tooltip title={`Probabilidad: ${r.probability}/5 | Impacto: ${r.impact}/5`}>
          <span className="font-mono font-bold">{r.probability}×{r.impact}={r.riskLevel}</span>
        </Tooltip>
      ),
      sorter: (a, b) => a.riskLevel - b.riskLevel,
    },
    {
      title: 'Nivel', dataIndex: 'riskLevel', key: 'riskLevel', width: 100,
      render: val => { const l = getRiskLevel(val); return <Tag color={l.tag}>{l.label}</Tag>; },
      filters: [
        { text: 'Extremo', value: 'extremo' },
        { text: 'Alto',    value: 'alto'    },
        { text: 'Medio',   value: 'medio'   },
        { text: 'Bajo',    value: 'bajo'    },
      ],
      onFilter: (value, record) => getRiskLevel(record.riskLevel).label.toLowerCase() === value,
    },
    {
      title: 'Tratamiento', dataIndex: 'treatment', key: 'treatment', width: 110,
      render: t => <Tag>{t}</Tag>,
    },
    {
      title: 'Estado', dataIndex: 'status', key: 'status', width: 100,
      render: s => <Badge status={s === 'active' ? 'error' : 'success'} text={s === 'active' ? 'Activo' : 'Mitigado'} />,
      filters: [{ text: 'Activo', value: 'active' }, { text: 'Mitigado', value: 'mitigado' }],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Norma', dataIndex: 'standard', key: 'standard', width: 100,
      render: s => s ? <Tag color="geekblue">{s?.toUpperCase()}</Tag> : '—',
    },
    {
      title: 'Acciones', key: 'actions', width: 110,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver detalle">
            <Button icon={<EyeOutlined />} size="small" onClick={() => setViewRisk(record)} />
          </Tooltip>
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} size="small" type="primary" ghost onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Input
          placeholder="Buscar por nombre, responsable o categoría..."
          prefix={<SearchOutlined />}
          className="w-80" allowClear
          onChange={e => setSearch(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onNew}>
          Identificar Riesgo
        </Button>
      </div>

      <Table
        columns={columns} dataSource={filtered} rowKey="id"
        loading={loading} size="middle"
        pagination={{ pageSize: 8, showTotal: t => `Total: ${t} riesgos` }}
        rowClassName={r => r.riskLevel >= 15 ? 'bg-red-50' : ''}
      />

      {/* Modal detalle */}
      <Modal
        title={`Detalle del Riesgo — ${viewRisk?.name}`}
        open={!!viewRisk} onCancel={() => setViewRisk(null)}
        footer={null} width={620}
      >
        {viewRisk && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Categoría">
              <Tag color={categoryLabels[viewRisk.category]?.color}>{categoryLabels[viewRisk.category]?.label}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Nivel">
              <Tag color={getRiskLevel(viewRisk.riskLevel).tag}>{getRiskLevel(viewRisk.riskLevel).label} ({viewRisk.riskLevel})</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Probabilidad">{viewRisk.probability}/5</Descriptions.Item>
            <Descriptions.Item label="Impacto">{viewRisk.impact}/5</Descriptions.Item>
            <Descriptions.Item label="Tratamiento">{viewRisk.treatment}</Descriptions.Item>
            <Descriptions.Item label="Estado">
              <Badge status={viewRisk.status === 'active' ? 'error' : 'success'} text={viewRisk.status === 'active' ? 'Activo' : 'Mitigado'} />
            </Descriptions.Item>
            <Descriptions.Item label="Responsable" span={2}>{viewRisk.responsible}</Descriptions.Item>
            <Descriptions.Item label="Descripción" span={2}>{viewRisk.description}</Descriptions.Item>
            <Descriptions.Item label="Causa" span={2}>{viewRisk.cause}</Descriptions.Item>
            <Descriptions.Item label="Efecto" span={2}>{viewRisk.effect}</Descriptions.Item>
            <Descriptions.Item label="Plan de Mitigación" span={2}>{viewRisk.mitigationPlan}</Descriptions.Item>
            <Descriptions.Item label="F. Identificación">{viewRisk.identificationDate}</Descriptions.Item>
            <Descriptions.Item label="F. Revisión">{viewRisk.reviewDate}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default RiskList;