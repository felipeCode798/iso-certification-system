// src/components/modules/audits/AuditChecklist.jsx
import React, { useState } from 'react';
import { Card, Checkbox, Button, Space, Tag, Progress, Input, message } from 'antd';
import { SaveOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const AuditChecklist = ({ auditId, checklist, onSave }) => {
  const [items, setItems] = useState(checklist || []);
  const [comments, setComments] = useState({});

  const handleCheck = (index, checked) => {
    const newItems = [...items];
    newItems[index].completed = checked;
    newItems[index].status = checked ? 'compliant' : 'non-compliant';
    setItems(newItems);
  };

  const handleComment = (index, value) => {
    setComments({ ...comments, [index]: value });
    const newItems = [...items];
    newItems[index].comment = value;
    setItems(newItems);
  };

  const calculateProgress = () => {
    const completed = items.filter(item => item.completed).length;
    return (completed / items.length) * 100;
  };

  const handleSave = async () => {
    try {
      await onSave(items);
      message.success('Lista de verificación guardada');
    } catch (error) {
      message.error('Error al guardar');
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'compliant') return <CheckCircleOutlined className="text-green-500" />;
    if (status === 'non-compliant') return <CloseCircleOutlined className="text-red-500" />;
    return null;
  };

  return (
    <Card
      title="Lista de Verificación de Auditoría"
      extra={
        <Space>
          <Progress type="circle" percent={calculateProgress()} width={50} />
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Guardar
          </Button>
        </Space>
      }
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index} size="small" className="bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    checked={item.completed}
                    onChange={(e) => handleCheck(index, e.target.checked)}
                  >
                    <span className="font-semibold">{item.question}</span>
                  </Checkbox>
                  {item.status && (
                    <Tag color={item.status === 'compliant' ? 'green' : 'red'}>
                      {item.status === 'compliant' ? 'Cumple' : 'No Cumple'}
                    </Tag>
                  )}
                </div>
                
                <TextArea
                  rows={2}
                  placeholder="Observaciones y evidencias..."
                  value={comments[index] || item.comment}
                  onChange={(e) => handleComment(index, e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="ml-4">
                {getStatusIcon(item.status)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default AuditChecklist;