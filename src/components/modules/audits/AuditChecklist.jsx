// src/components/modules/audits/AuditChecklist.jsx
import React, { useState } from 'react';
import { Card, Checkbox, Button, Space, Tag, Progress, Input, message, Collapse, Upload, Modal, Tabs } from 'antd';
import { SaveOutlined, CheckCircleOutlined, CloseCircleOutlined, UploadOutlined, FileImageOutlined, PaperClipOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Panel } = Collapse;

const AuditChecklist = ({ auditId, checklist: initialChecklist, onSave }) => {
  const [checklist, setChecklist] = useState(initialChecklist || getDefaultChecklist());
  const [evidenceModal, setEvidenceModal] = useState({ visible: false, itemIndex: null });
  const [evidenceFiles, setEvidenceFiles] = useState({});

  const getDefaultChecklist = () => [
    { id: 1, category: 'Documentación', question: '¿El manual de calidad está actualizado y aprobado?', completed: false, status: null, comment: '', evidence: [] },
    { id: 2, category: 'Documentación', question: '¿Los procedimientos documentados son accesibles al personal?', completed: false, status: null, comment: '', evidence: [] },
    { id: 3, category: 'Liderazgo', question: '¿La dirección ha definido la política de calidad?', completed: false, status: null, comment: '', evidence: [] },
    { id: 4, category: 'Liderazgo', question: '¿Se han asignado responsabilidades y autoridades?', completed: false, status: null, comment: '', evidence: [] },
    { id: 5, category: 'Planificación', question: '¿Se han identificado y evaluado los riesgos?', completed: false, status: null, comment: '', evidence: [] },
    { id: 6, category: 'Planificación', question: '¿Los objetivos de calidad son medibles y están comunicados?', completed: false, status: null, comment: '', evidence: [] },
    { id: 7, category: 'Operación', question: '¿Se controlan los procesos externos y compras?', completed: false, status: null, comment: '', evidence: [] },
    { id: 8, category: 'Operación', question: '¿Se realizan validaciones de los procesos productivos?', completed: false, status: null, comment: '', evidence: [] },
    { id: 9, category: 'Evaluación', question: '¿Se realiza seguimiento y medición de procesos?', completed: false, status: null, comment: '', evidence: [] },
    { id: 10, category: 'Evaluación', question: '¿Se realiza auditorías internas periódicas?', completed: false, status: null, comment: '', evidence: [] },
    { id: 11, category: 'Mejora', question: '¿Se gestionan las no conformidades y acciones correctivas?', completed: false, status: null, comment: '', evidence: [] },
    { id: 12, category: 'Mejora', question: '¿Se implementan acciones de mejora continua?', completed: false, status: null, comment: '', evidence: [] },
  ];

  const handleCheck = (index, checked) => {
    const newChecklist = [...checklist];
    newChecklist[index].completed = checked;
    newChecklist[index].status = checked ? 'compliant' : 'non-compliant';
    setChecklist(newChecklist);
  };

  const handleComment = (index, value) => {
    const newChecklist = [...checklist];
    newChecklist[index].comment = value;
    setChecklist(newChecklist);
  };

  const handleAddEvidence = (index, file) => {
    const newChecklist = [...checklist];
    const evidenceUrl = URL.createObjectURL(file);
    newChecklist[index].evidence = [...(newChecklist[index].evidence || []), { name: file.name, url: evidenceUrl, type: file.type }];
    setChecklist(newChecklist);
    setEvidenceFiles({ ...evidenceFiles, [index]: [...(evidenceFiles[index] || []), file] });
    message.success('Evidencia agregada');
  };

  const calculateProgress = () => {
    const completed = checklist.filter(item => item.completed).length;
    return (completed / checklist.length) * 100;
  };

  const getStats = () => {
    const compliant = checklist.filter(item => item.status === 'compliant').length;
    const nonCompliant = checklist.filter(item => item.status === 'non-compliant').length;
    return { total: checklist.length, compliant, nonCompliant, pending: checklist.length - compliant - nonCompliant };
  };

  const handleSave = async () => {
    try {
      const report = {
        auditId,
        checklist,
        summary: getStats(),
        completionDate: new Date().toISOString(),
      };
      await onSave(report);
      message.success('Lista de verificación guardada');
    } catch (error) {
      message.error('Error al guardar');
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'compliant') return <CheckCircleOutlined className="text-green-500 text-xl" />;
    if (status === 'non-compliant') return <CloseCircleOutlined className="text-red-500 text-xl" />;
    return null;
  };

  const stats = getStats();

  return (
    <Card
      title="Lista de Verificación de Auditoría"
      extra={
        <Space>
          <div className="text-center">
            <Progress type="circle" percent={calculateProgress()} width={60} />
            <div className="text-xs mt-1">Progreso</div>
          </div>
          <div className="border-l pl-4">
            <Space>
              <Tag color="green">Cumple: {stats.compliant}</Tag>
              <Tag color="red">No Cumple: {stats.nonCompliant}</Tag>
              <Tag>Pendiente: {stats.pending}</Tag>
            </Space>
          </div>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Guardar
          </Button>
        </Space>
      }
    >
      <Collapse accordion defaultActiveKey={['0']}>
        {Object.entries(checklist.reduce((acc, item, idx) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push({ ...item, idx });
          return acc;
        }, {})).map(([category, items], catIdx) => (
          <Panel header={<span className="font-semibold">{category} ({items.filter(i => i.completed).length}/{items.length})</span>} key={catIdx}>
            {items.map((item, idx) => (
              <Card key={item.id} size="small" className="mb-3 bg-gray-50" style={{ borderLeft: `4px solid ${item.status === 'compliant' ? '#52c41a' : item.status === 'non-compliant' ? '#f5222d' : '#d9d9d9'}` }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Checkbox checked={item.completed} onChange={(e) => handleCheck(item.idx, e.target.checked)}>
                        <span className="font-semibold">{item.question}</span>
                      </Checkbox>
                      {item.status && <Tag color={item.status === 'compliant' ? 'green' : 'red'}>{item.status === 'compliant' ? 'Cumple' : 'No Cumple'}</Tag>}
                    </div>
                    
                    <TextArea rows={2} placeholder="Observaciones, hallazgos y evidencias..." value={item.comment} onChange={(e) => handleComment(item.idx, e.target.value)} className="mt-2" />

                    <div className="mt-2">
                      <Upload beforeUpload={(file) => { handleAddEvidence(item.idx, file); return false; }} showUploadList={false}>
                        <Button size="small" icon={<PaperClipOutlined />}>Adjuntar evidencia</Button>
                      </Upload>
                      {item.evidence?.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {item.evidence.map((ev, evIdx) => (
                            <Tag key={evIdx} closable onClose={() => { const newChecklist = [...checklist]; newChecklist[item.idx].evidence.splice(evIdx, 1); setChecklist(newChecklist); }} className="cursor-pointer">
                              {ev.type.startsWith('image/') ? <FileImageOutlined /> : <PaperClipOutlined />} {ev.name}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">{getStatusIcon(item.status)}</div>
                </div>
              </Card>
            ))}
          </Panel>
        ))}
      </Collapse>
    </Card>
  );
};

export default AuditChecklist;