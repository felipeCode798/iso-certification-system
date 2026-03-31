import React, { useState } from 'react';
import { Tabs, message } from 'antd';
import { ApartmentOutlined, UnorderedListOutlined, LineChartOutlined } from '@ant-design/icons';
import ProcessMap from '../../components/modules/processes/ProcessMap';
import ProcessList from '../../components/modules/processes/ProcessList';
import ProcessMetrics from '../../components/modules/processes/ProcessMetrics';
import ProcessForm from '../../components/modules/processes/ProcessForm';
import {
  useGetProcessesQuery,
  useCreateProcessMutation,
  useUpdateProcessMutation,
  useDeleteProcessMutation,
} from '../../services/api/processesService';

const ProcessesPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [metricsProcess, setMetricsProcess] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  const { data: processes = [], isLoading } = useGetProcessesQuery();
  const { mutateAsync: createProcess } = useCreateProcessMutation();
  const { mutateAsync: updateProcess } = useUpdateProcessMutation();
  const { mutateAsync: deleteProcess } = useDeleteProcessMutation();

  const handleSubmit = async (values) => {
    try {
      if (values.id) {
        await updateProcess({ id: values.id, data: values });
        message.success('Proceso actualizado');
      } else {
        await createProcess(values);
        message.success('Proceso creado');
      }
      setIsFormVisible(false);
      setSelectedProcess(null);
    } catch {
      message.error('Error al guardar el proceso');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProcess(id);
      message.success('Proceso eliminado');
      if (metricsProcess?.id === id) setMetricsProcess(null);
    } catch {
      message.error('Error al eliminar');
    }
  };

  const handleViewMetrics = (process) => {
    setMetricsProcess(process);
    setActiveTab('metrics');
  };

  const tabs = [
    {
      key: 'list',
      label: <span><UnorderedListOutlined /> Lista de Procesos</span>,
      children: (
        <ProcessList
          processes={processes}
          loading={isLoading}
          onEdit={(p) => { setSelectedProcess(p); setIsFormVisible(true); }}
          onDelete={handleDelete}
          onViewMetrics={handleViewMetrics}
          onNew={() => { setSelectedProcess(null); setIsFormVisible(true); }}
        />
      ),
    },
    {
      key: 'map',
      label: <span><ApartmentOutlined /> Mapa de Procesos</span>,
      children: <ProcessMap processes={processes} />,
    },
    {
      key: 'metrics',
      label: <span><LineChartOutlined /> Métricas</span>,
      children: <ProcessMetrics process={metricsProcess} />,
    },
  ];

  return (
    <div className="processes-page">
      <h1 className="text-2xl font-bold mb-4">Gestión de Procesos</h1>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabs}
        type="card"
      />

      <ProcessForm
        visible={isFormVisible}
        onClose={() => { setIsFormVisible(false); setSelectedProcess(null); }}
        onSubmit={handleSubmit}
        process={selectedProcess}
      />
    </div>
  );
};

export default ProcessesPage;