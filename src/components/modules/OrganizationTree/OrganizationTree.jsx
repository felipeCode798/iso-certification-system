// src/components/modules/OrganizationTree/OrganizationTree.jsx
import React, { useState, useEffect } from 'react';
import { Tree, Card, Avatar, Badge, Button, Modal, Form, Input, Select, message } from 'antd';
import { UserOutlined, PlusOutlined, ApartmentOutlined, TeamOutlined } from '@ant-design/icons';
import apiClient from '../../../services/api/apiClient';

export const OrganizationTree = () => {
  const [treeData, setTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadOrganizationTree();
  }, []);

  const loadOrganizationTree = async () => {
    try {
      const response = await apiClient.get('/organization/tree');
      const formattedTree = formatTreeData(response.data);
      setTreeData(formattedTree);
    } catch (error) {
      message.error('Error al cargar el organigrama');
    }
  };

  const formatTreeData = (data) => {
    // Convertir la jerarquía en formato para Ant Design Tree
    const departments = Object.values(data);
    
    return departments.map(dept => ({
      key: `dept-${dept.id}`,
      title: (
        <div>
          <ApartmentOutlined style={{ marginRight: 8 }} />
          {dept.name}
          <Badge count={Object.keys(dept.areas).length} style={{ marginLeft: 8 }} />
        </div>
      ),
      children: Object.values(dept.areas).map(area => ({
        key: `area-${area.id}`,
        title: (
          <div>
            <TeamOutlined style={{ marginRight: 8 }} />
            {area.name}
            <Badge count={Object.keys(area.positions).length} style={{ marginLeft: 8 }} />
          </div>
        ),
        children: Object.values(area.positions).map(position => ({
          key: `pos-${position.id}`,
          title: (
            <div>
              <UserOutlined style={{ marginRight: 8 }} />
              {position.name}
              <Badge 
                count={position.users.length} 
                style={{ marginLeft: 8, backgroundColor: '#52c41a' }} 
              />
            </div>
          ),
          children: position.users.map(user => ({
            key: `user-${user.id}`,
            title: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
                {user.name} {user.lastName}
                {user.supervisorId ? (
                  <Tag color="blue" style={{ marginLeft: 8 }} size="small">Supervisado</Tag>
                ) : (
                  <Tag color="gold" style={{ marginLeft: 8 }} size="small">Líder</Tag>
                )}
              </div>
            ),
            isLeaf: true
          }))
        }))
      }))
    }));
  };

  const handleAddUser = () => {
    setModalVisible(true);
  };

  const handleUserSubmit = async (values) => {
    try {
      await apiClient.post('/users', values);
      message.success('Usuario creado exitosamente');
      setModalVisible(false);
      form.resetFields();
      loadOrganizationTree();
    } catch (error) {
      message.error('Error al crear usuario');
    }
  };

  return (
    <Card
      title="Organigrama de la Empresa"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
          Nuevo Colaborador
        </Button>
      }
    >
      <Tree
        showLine
        showIcon
        defaultExpandAll
        treeData={treeData}
        onSelect={(keys, info) => setSelectedNode(info.node)}
      />

      <Modal
        title="Agregar Colaborador"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleUserSubmit} layout="vertical">
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Apellido" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="positionId" label="Cargo" rules={[{ required: true }]}>
            <Select placeholder="Seleccione un cargo">
              {/* Cargar posiciones desde el backend */}
            </Select>
          </Form.Item>
          <Form.Item name="roleId" label="Rol" rules={[{ required: true }]}>
            <Select placeholder="Seleccione un rol">
              {/* Cargar roles desde el backend */}
            </Select>
          </Form.Item>
          <Form.Item name="supervisorId" label="Supervisor">
            <Select placeholder="Seleccione un supervisor (opcional)">
              {/* Cargar supervisores desde el backend */}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Crear Colaborador
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};