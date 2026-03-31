import React, { useState } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Slider, Select, Badge, Statistic, Row, Col } from 'antd';
import { CalculatorOutlined, SaveOutlined } from '@ant-design/icons';

const getRiskLevel = (score) => {
  if (score >= 20) return { label: 'Extremo', color: '#ff4d4f', tag: 'red'    };
  if (score >= 15) return { label: 'Alto',    color: '#ff7a45', tag: 'orange' };
  if (score >= 8)  return { label: 'Medio',   color: '#fadb14', tag: 'yellow' };
  return                  { label: 'Bajo',    color: '#52c41a', tag: 'green'  };
};

const RiskAssessment = ({ risks = [], onUpdate }) => {
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [form] = Form.useForm();
  const [previewProb, setPreviewProb]   = useState(1);
  const [previewImp,  setPreviewImp]    = useState(1);

  const previewScore = previewProb * previewImp;
  const previewLevel = getRiskLevel(previewScore);

  const openAssessment = (risk) => {
    setSelectedRisk(risk);
    setPreviewProb(risk.probability);
    setPreviewImp(risk.impact);
    form.setFieldsValue({ probability: risk.probability, impact: risk.impact, treatment: risk.treatment });
  };

  const handleSave = (values) => {
    const newScore = values.probability * values.impact;
    onUpdate({ ...selectedRisk, ...values, riskLevel: newScore });
    setSelectedRisk(null);
  };

  const columns = [
    {
      title: 'Riesgo', dataIndex: 'name', key: 'name',
      render: (name, r) => <div><div className="font-medium">{name}</div><div className="text-xs text-gray-400">{r.responsible}</div></div>,
    },
    { title: 'P', dataIndex: 'probability', key: 'probability', width: 60, render: v => <strong>{v}</strong> },
    { title: 'I', dataIndex: 'impact',      key: 'impact',      width: 60, render: v => <strong>{v}</strong> },
    {
      title: 'P×I', dataIndex: 'riskLevel', key: 'riskLevel', width: 80,
      render: val => { const l = getRiskLevel(val); return <Tag color={l.tag}>{val} — {l.label}</Tag>; },
      sorter: (a, b) => b.riskLevel - a.riskLevel,
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Tratamiento', dataIndex: 'treatment', key: 'treatment', width: 110,
      render: t => <Tag>{t || '—'}</Tag>,
    },
    {
      title: 'Estado', dataIndex: 'status', key: 'status', width: 100,
      render: s => <Badge status={s === 'active' ? 'error' : 'success'} text={s === 'active' ? 'Activo' : 'Mitigado'} />,
    },
    {
      title: 'Evaluar', key: 'actions', width: 100,
      render: (_, record) => (
        <Button icon={<CalculatorOutlined />} size="small" type="primary" ghost onClick={() => openAssessment(record)}>
          Evaluar
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Resumen estadístico */}
      <Row gutter={[12, 12]} className="mb-4">
        {[
          { label: 'Extremos', filter: r => r.riskLevel >= 20, color: '#ff4d4f' },
          { label: 'Altos',    filter: r => r.riskLevel >= 15 && r.riskLevel < 20, color: '#ff7a45' },
          { label: 'Medios',   filter: r => r.riskLevel >= 8  && r.riskLevel < 15, color: '#fadb14' },
          { label: 'Bajos',    filter: r => r.riskLevel < 8,  color: '#52c41a' },
        ].map(({ label, filter, color }) => (
          <Col span={6} key={label}>
            <div className="rounded-lg p-3 text-center border" style={{ borderColor: color, background: color + '15' }}>
              <div className="text-2xl font-bold" style={{ color }}>{risks.filter(filter).length}</div>
              <div className="text-xs text-gray-500 mt-1">Riesgos {label}</div>
            </div>
          </Col>
        ))}
      </Row>

      <Table columns={columns} dataSource={risks} rowKey="id" size="middle"
        pagination={{ pageSize: 8 }}
        rowClassName={r => r.riskLevel >= 15 ? 'bg-orange-50' : ''}
      />

      <Modal
        title={`Evaluar: ${selectedRisk?.name}`}
        open={!!selectedRisk}
        onCancel={() => setSelectedRisk(null)}
        footer={null}
        width={520}
      >
        {/* Preview del nivel calculado */}
        <div className="mb-4 p-4 rounded-lg text-center" style={{ background: previewLevel.color + '20', border: `2px solid ${previewLevel.color}` }}>
          <div className="text-sm text-gray-500 mb-1">Nivel de Riesgo Calculado</div>
          <div className="text-3xl font-bold mb-1" style={{ color: previewLevel.color }}>{previewScore}</div>
          <Tag color={previewLevel.tag} className="text-sm px-3">{previewLevel.label}</Tag>
          <div className="text-xs text-gray-400 mt-1">Probabilidad ({previewProb}) × Impacto ({previewImp})</div>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label={`Probabilidad: ${previewProb}/5`} name="probability">
            <Slider
              min={1} max={5} step={1}
              marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }}
              onChange={v => setPreviewProb(v)}
              trackStyle={{ background: previewLevel.color }}
              handleStyle={{ borderColor: previewLevel.color }}
            />
          </Form.Item>

          <Form.Item label={`Impacto: ${previewImp}/5`} name="impact" className="mt-2">
            <Slider
              min={1} max={5} step={1}
              marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }}
              onChange={v => setPreviewImp(v)}
              trackStyle={{ background: previewLevel.color }}
              handleStyle={{ borderColor: previewLevel.color }}
            />
          </Form.Item>

          <Form.Item label="Tratamiento del Riesgo" name="treatment" rules={[{ required: true }]} className="mt-4">
            <Select>
              {['Evitar','Mitigar','Transferir','Aceptar','Controlar'].map(t => (
                <Select.Option key={t} value={t}>{t}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex gap-2 mt-2">
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} block>
              Guardar Evaluación
            </Button>
            <Button onClick={() => setSelectedRisk(null)} block>
              Cancelar
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RiskAssessment;