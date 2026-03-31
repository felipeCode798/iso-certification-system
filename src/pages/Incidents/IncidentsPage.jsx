import React, { useState } from 'react';
import { Tabs, message } from 'antd';
import { UnorderedListOutlined, SolutionOutlined } from '@ant-design/icons';
import IncidentList       from '../../components/modules/incidents/IncidentList';
import IncidentResolution from '../../components/modules/incidents/IncidentResolution';
import IncidentForm       from '../../components/modules/incidents/IncidentForm';
import {
  useGetIncidentsQuery,
  useCreateIncidentMutation,
  useUpdateIncidentMutation,
  useResolveIncidentMutation,
  useDeleteIncidentMutation,
} from '../../services/api/incidentsService';

const IncidentsPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  const { data: incidents = [], isLoading }  = useGetIncidentsQuery();
  const { mutateAsync: createIncident }      = useCreateIncidentMutation();
  const { mutateAsync: updateIncident }      = useUpdateIncidentMutation();
  const { mutateAsync: resolveIncident }     = useResolveIncidentMutation();
  const { mutateAsync: deleteIncident }      = useDeleteIncidentMutation();

  const handleSubmit = async (values) => {
    try {
      if (values.id) {
        await updateIncident({ id: values.id, data: values });
        message.success('Incidente actualizado');
      } else {
        await createIncident(values);
        message.success('Incidente registrado');
      }
      setIsFormVisible(false);
      setSelectedIncident(null);
    } catch {
      message.error('Error al guardar');
    }
  };

  const handleResolve = async ({ id, resolution }) => {
    try {
      await resolveIncident({ id, resolution });
      message.success('Incidente resuelto exitosamente');
    } catch {
      message.error('Error al resolver el incidente');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteIncident(id);
      message.success('Incidente eliminado');
    } catch {
      message.error('Error al eliminar');
    }
  };

  // Navegar a resolución desde el detalle
  const handleGoToResolution = (incident) => {
    setActiveTab('resolution');
  };

  const tabs = [
    {
      key: 'list',
      label: <span><UnorderedListOutlined /> Gestión de Incidentes</span>,
      children: (
        <IncidentList
          incidents={incidents}
          loading={isLoading}
          onEdit={i => { setSelectedIncident(i); setIsFormVisible(true); }}
          onDelete={handleDelete}
          onNew={() => { setSelectedIncident(null); setIsFormVisible(true); }}
          onResolve={handleGoToResolution}
        />
      ),
    },
    {
      key: 'resolution',
      label: <span><SolutionOutlined /> Resolución</span>,
      children: (
        <IncidentResolution
          incidents={incidents}
          onResolve={handleResolve}
        />
      ),
    },
  ];

  return (
    <div className="incidents-page">
      <h1 className="text-2xl font-bold mb-4">Gestión de Incidentes</h1>
      <Tabs items={tabs} type="card" activeKey={activeTab} onChange={setActiveTab} />
      <IncidentForm
        visible={isFormVisible}
        onClose={() => { setIsFormVisible(false); setSelectedIncident(null); }}
        onSubmit={handleSubmit}
        incident={selectedIncident}
      />
    </div>
  );
};

export default IncidentsPage;