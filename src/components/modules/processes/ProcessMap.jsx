import React, { useState } from 'react';
import { Card, Row, Col, Tag, Tooltip, Modal, Descriptions, Badge } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';

const typeConfig = {
  strategic: { color: '#722ed1', bg: '#f9f0ff', border: '#d3adf7', label: 'Estratégico' },
  core:      { color: '#1890ff', bg: '#e6f7ff', border: '#91d5ff', label: 'Operativo'   },
  support:   { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f', label: 'Soporte'     },
};

const ProcessNode = ({ process, onClick }) => {
  const cfg = typeConfig[process.type];
  return (
    <Tooltip title={`Dueño: ${process.owner} | Eficacia: ${process.effectiveness}%`}>
      <div
        onClick={() => onClick(process)}
        className="cursor-pointer rounded-lg p-3 text-center transition-all hover:shadow-lg"
        style={{
          background: cfg.bg,
          border: `2px solid ${cfg.border}`,
          minWidth: 140,
          userSelect: 'none',
        }}
      >
        <div className="text-xs font-bold mb-1" style={{ color: cfg.color }}>{process.code}</div>
        <div className="text-sm font-semibold text-gray-800 leading-tight">{process.name}</div>
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">{process.effectiveness}% eficacia</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${process.effectiveness}%`,
                background: process.effectiveness >= 90 ? '#52c41a' : process.effectiveness >= 75 ? '#faad14' : '#ff4d4f',
              }}
            />
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

const ProcessMap = ({ processes = [] }) => {
  const [selected, setSelected] = useState(null);

  const strategic = processes.filter(p => p.type === 'strategic');
  const core      = processes.filter(p => p.type === 'core');
  const support   = processes.filter(p => p.type === 'support');

  const SectionLabel = ({ label, color, count }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-6 rounded" style={{ background: color }} />
      <span className="font-semibold text-gray-700">{label}</span>
      <Tag color={color === '#722ed1' ? 'purple' : color === '#1890ff' ? 'blue' : 'green'}>
        {count} procesos
      </Tag>
    </div>
  );

  return (
    <div className="process-map">
      {/* Sección Estratégicos */}
      <div className="mb-4 p-4 rounded-lg" style={{ background: '#fafafa', border: '1px dashed #d3adf7' }}>
        <SectionLabel label="Procesos Estratégicos" color="#722ed1" count={strategic.length} />
        <div className="flex gap-4 flex-wrap">
          {strategic.map(p => <ProcessNode key={p.id} process={p} onClick={setSelected} />)}
        </div>
      </div>

      {/* Flecha */}
      <div className="flex justify-center my-2 text-gray-400 text-xl">↕</div>

      {/* Sección Operativos (core) */}
      <div className="mb-4 p-4 rounded-lg" style={{ background: '#fafafa', border: '1px dashed #91d5ff' }}>
        <SectionLabel label="Procesos Operativos (Core)" color="#1890ff" count={core.length} />
        <div className="flex gap-4 flex-wrap">
          {core.map(p => <ProcessNode key={p.id} process={p} onClick={setSelected} />)}
        </div>
      </div>

      {/* Flecha */}
      <div className="flex justify-center my-2 text-gray-400 text-xl">↕</div>

      {/* Sección Soporte */}
      <div className="p-4 rounded-lg" style={{ background: '#fafafa', border: '1px dashed #b7eb8f' }}>
        <SectionLabel label="Procesos de Soporte" color="#52c41a" count={support.length} />
        <div className="flex gap-4 flex-wrap">
          {support.map(p => <ProcessNode key={p.id} process={p} onClick={setSelected} />)}
        </div>
      </div>

      {/* Modal detalle */}
      <Modal
        title={`${selected?.code} — ${selected?.name}`}
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
        width={560}
      >
        {selected && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Tipo" span={1}>
                <Tag color={typeConfig[selected.type]?.color === '#722ed1' ? 'purple' : selected.type === 'core' ? 'blue' : 'green'}>
                  {typeConfig[selected.type]?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Estado">
                <Badge status={selected.status === 'active' ? 'success' : 'warning'} text={selected.status === 'active' ? 'Activo' : 'En Revisión'} />
              </Descriptions.Item>
              <Descriptions.Item label="Dueño" span={2}>{selected.owner}</Descriptions.Item>
              <Descriptions.Item label="Descripción" span={2}>{selected.description}</Descriptions.Item>
              <Descriptions.Item label="Entradas" span={2}>{selected.inputs}</Descriptions.Item>
              <Descriptions.Item label="Salidas" span={2}>{selected.outputs}</Descriptions.Item>
              <Descriptions.Item label="Recursos" span={2}>{selected.resources}</Descriptions.Item>
              <Descriptions.Item label="Indicadores" span={2}>{selected.indicators}</Descriptions.Item>
              <Descriptions.Item label="Eficacia">
                <span style={{ color: selected.effectiveness >= 90 ? '#52c41a' : '#faad14' }}>
                  {selected.effectiveness}%
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Eficiencia">{selected.efficiency}%</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProcessMap;