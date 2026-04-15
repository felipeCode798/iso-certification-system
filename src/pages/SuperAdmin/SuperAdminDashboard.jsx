// src/pages/SuperAdmin/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, message, Space, Tag, Statistic, Row, Col } from 'antd';
import { 
  PlusOutlined, 
  BuildOutlined, 
  UserOutlined, 
  SafetyOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import apiClient from '../../services/api/apiClient';
import CreateCompanyModal from './CreateCompanyModal';

const SuperAdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    totalUsers: 0,
    activeSubscriptions: 0,
  });

  useEffect(() => {
    loadCompanies();
    loadStats();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      message.error('Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiClient.get('/companies/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleToggleStatus = async (companyId, currentStatus) => {
    try {
      const action = currentStatus === 'active' ? 'deactivate' : 'activate';
      await apiClient.post(`/companies/${companyId}/${action}`);
      message.success(`Empresa ${currentStatus === 'active' ? 'desactivada' : 'activada'} exitosamente`);
      loadCompanies();
      loadStats();
    } catch (error) {
      message.error('Error al cambiar el estado');
    }
  };

  const columns = [
    {
      title: 'NIT',
      dataIndex: 'nit',
      key: 'nit',
    },
    {
      title: 'Razón Social',
      dataIndex: 'businessName',
      key: 'businessName',
    },
    {
      title: 'Sede',
      dataIndex: 'headquarters',
      key: 'headquarters',
    },
    {
      title: 'Plan',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier) => {
        const colors = {
          basic: 'blue',
          professional: 'gold',
          enterprise: 'green',
        };
        return <Tag color={colors[tier]}>{tier?.toUpperCase() || 'BASIC'}</Tag>;
      },
    },
    {
      title: 'Normas ISO',
      dataIndex: 'isoConfig',
      key: 'isoStandards',
      render: (isoConfig) => (
        <Space>
          {isoConfig?.standards?.map(std => (
            <Tag key={std} color="cyan">ISO {std}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Usuarios',
      dataIndex: 'users',
      key: 'usersCount',
      render: (users) => users?.length || 0,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Space>
          <Tag color={status === 'active' ? 'green' : 'red'}>
            {status === 'active' ? 'Activa' : 'Inactiva'}
          </Tag>
          <Button
            type="link"
            size="small"
            onClick={() => handleToggleStatus(record.id, status)}
            icon={status === 'active' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
          >
            {status === 'active' ? 'Desactivar' : 'Activar'}
          </Button>
        </Space>
      ),
    },
    {
      title: 'Creada',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => {
              localStorage.setItem('selectedCompanyId', record.id);
              window.location.href = '/';
            }}
          >
            Acceder
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Panel de Control - Super Administrador</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setModalVisible(true)}
          size="large"
        >
          Nueva Empresa
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Empresas"
              value={stats.totalCompanies}
              prefix={<BuildOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Empresas Activas"
              value={stats.activeCompanies}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Usuarios Totales"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Suscripciones Activas"
              value={stats.activeSubscriptions}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Empresas del Sistema">
        <Table
          columns={columns}
          dataSource={companies}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <CreateCompanyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false);
          loadCompanies();
          loadStats();
        }}
      />
    </div>
  );
};

export default SuperAdminDashboard;