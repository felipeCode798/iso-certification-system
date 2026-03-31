import React, { useState } from 'react';
import { Tabs, message } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined, CalculatorOutlined } from '@ant-design/icons';
import RiskMatrix     from '../../components/modules/risks/RiskMatrix';
import RiskList       from '../../components/modules/risks/RiskList';
import RiskAssessment from '../../components/modules/risks/RiskAssessment';
import RiskForm       from '../../components/modules/risks/RiskForm';
import {
  useGetRisksQuery,
  useCreateRiskMutation,
  useUpdateRiskMutation,
  useDeleteRiskMutation,
} from '../../services/api/risksService';

const RisksPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedRisk, setSelectedRisk]   = useState(null);

  const { data: risks = [], isLoading }   = useGetRisksQuery();
  const { mutateAsync: createRisk }       = useCreateRiskMutation();
  const { mutateAsync: updateRisk }       = useUpdateRiskMutation();
  const { mutateAsync: deleteRisk }       = useDeleteRiskMutation();

  const handleSubmit = async (values) => {
    try {
      if (values.id) {
        await updateRisk({ id: values.id, data: values });
        message.success('Riesgo actualizado');
      } else {
        await createRisk(values);
        message.success('Riesgo registrado');
      }
      setIsFormVisible(false);
      setSelectedRisk(null);
    } catch {
      message.error('Error al guardar el riesgo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRisk(id);
      message.success('Riesgo eliminado');
    } catch {
      message.error('Error al eliminar');
    }
  };

  const handleAssessmentUpdate = async (updatedRisk) => {
    try {
      await updateRisk({ id: updatedRisk.id, data: updatedRisk });
      message.success('Evaluación guardada');
    } catch {
      message.error('Error al actualizar evaluación');
    }
  };

  const tabs = [
    {
      key: 'matrix',
      label: <span><AppstoreOutlined /> Matriz de Riesgos</span>,
      children: <RiskMatrix risks={risks} />,
    },
    {
      key: 'list',
      label: <span><UnorderedListOutlined /> Registro de Riesgos</span>,
      children: (
        <RiskList
          risks={risks}
          loading={isLoading}
          onEdit={r => { setSelectedRisk(r); setIsFormVisible(true); }}
          onDelete={handleDelete}
          onNew={() => { setSelectedRisk(null); setIsFormVisible(true); }}
        />
      ),
    },
    {
      key: 'assessment',
      label: <span><CalculatorOutlined /> Evaluación</span>,
      children: <RiskAssessment risks={risks} onUpdate={handleAssessmentUpdate} />,
    },
  ];

  return (
    <div className="risks-page">
      <h1 className="text-2xl font-bold mb-4">Gestión de Riesgos</h1>

      <Tabs items={tabs} type="card" defaultActiveKey="matrix" />

      <RiskForm
        visible={isFormVisible}
        onClose={() => { setIsFormVisible(false); setSelectedRisk(null); }}
        onSubmit={handleSubmit}
        risk={selectedRisk}
      />
    </div>
  );
};

export default RisksPage;