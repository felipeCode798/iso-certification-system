// src/pages/SuperAdmin/CreateCompanyModal.jsx
import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Steps, message, Row, Col, Divider, Alert, Card } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import apiClient from '../../services/api/apiClient';

const { Step } = Steps;
const { Option } = Select;

const CreateCompanyModal = ({ visible, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [companyForm] = Form.useForm();
  const [managerForm] = Form.useForm();
  const [structureForm] = Form.useForm();

  const handleCreate = async () => {
    try {
      const companyValues = await companyForm.validateFields();
      const managerValues = await managerForm.validateFields();
      const structureValues = structureForm.getFieldsValue();

      setLoading(true);

      const payload = {
        ...companyValues,
        manager: managerValues,
        initialStructure: structureValues.departments?.length > 0 ? {
          departments: structureValues.departments,
        } : undefined,
        isoConfig: {
          standards: companyValues.isoStandards || ['9001'],
          managementReviewCycle: companyValues.managementReviewCycle || 'quarterly',
          auditCycle: companyValues.auditCycle || 'semiannual',
        },
      };

      await apiClient.post('/companies', payload);
      
      message.success(`Empresa ${companyValues.businessName} creada exitosamente`);
      message.info(`Se ha enviado un correo al gerente con sus credenciales`);
      
      companyForm.resetFields();
      managerForm.resetFields();
      structureForm.resetFields();
      setCurrentStep(0);
      onSuccess();
      
    } catch (error) {
      console.error('Error:', error);
      message.error(error.response?.data?.message || 'Error al crear la empresa');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Datos Empresa',
      content: (
        <Form form={companyForm} layout="vertical">
          <Alert
            message="Información de la Empresa"
            description="Complete los datos legales y de contacto"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nit"
                label="NIT"
                rules={[{ required: true, message: 'NIT requerido' }]}
              >
                <Input placeholder="Ej: 900123456-7" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="businessName"
                label="Razón Social"
                rules={[{ required: true, message: 'Razón social requerida' }]}
              >
                <Input placeholder="Nombre legal" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="tradeName" label="Nombre Comercial">
            <Input placeholder="Nombre comercial" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="headquarters"
                label="Sede Principal"
                rules={[{ required: true, message: 'Sede requerida' }]}
              >
                <Input placeholder="Ciudad" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sector" label="Sector">
                <Select placeholder="Seleccione">
                  <Option value="tecnologia">Tecnología</Option>
                  <Option value="manufactura">Manufactura</Option>
                  <Option value="servicios">Servicios</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="phone" label="Teléfono">
                <Input placeholder="Teléfono" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input type="email" placeholder="contacto@empresa.com" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="Dirección">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Divider>Configuración ISO</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isoStandards" label="Normas ISO" initialValue={['9001']}>
                <Select mode="multiple">
                  <Option value="9001">ISO 9001:2015 - Calidad</Option>
                  <Option value="27001">ISO 27001:2022 - Seguridad</Option>
                  <Option value="20000">ISO 20000:2018 - Servicios TI</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tier" label="Plan" initialValue="basic">
                <Select>
                  <Option value="basic">Básico - 10 usuarios</Option>
                  <Option value="professional">Profesional - 50 usuarios</Option>
                  <Option value="enterprise">Empresarial - Usuarios ilimitados</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      title: 'Gerente',
      content: (
        <Form form={managerForm} layout="vertical">
          <Alert
            message="Datos del Gerente"
            description="Este será el administrador principal de la empresa"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Nombre"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Apellido"
                rules={[{ required: true }]}
              >
                <Input placeholder="Apellido" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email requerido' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input placeholder="gerente@empresa.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña Temporal"
            initialValue="Temp123456!"
            rules={[
              { required: true },
              { min: 6, message: 'Mínimo 6 caracteres' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="phone" label="Teléfono">
            <Input placeholder="Teléfono" />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Estructura',
      content: (
        <Form form={structureForm} layout="vertical">
          <Alert
            message="Estructura Organizacional (Opcional)"
            description="Puede crear la estructura básica o dejarla para después"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Form.List name="departments">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    title={`Departamento ${index + 1}`}
                    size="small"
                    extra={
                      <Button type="link" danger onClick={() => remove(field.name)} icon={<DeleteOutlined />} />
                    }
                    style={{ marginBottom: 16 }}
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'name']}
                      label="Nombre"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Ej: Operaciones" />
                    </Form.Item>

                    <Form.List name={[field.name, 'areas']}>
                      {(areaFields, { add: addArea, remove: removeArea }) => (
                        <>
                          {areaFields.map((areaField) => (
                            <div key={areaField.key} style={{ marginLeft: 24, marginBottom: 8 }}>
                              <Row gutter={8}>
                                <Col span={20}>
                                  <Form.Item
                                    {...areaField}
                                    name={[areaField.name, 'name']}
                                    label="Área"
                                    rules={[{ required: true }]}
                                  >
                                    <Input placeholder="Nombre del área" />
                                  </Form.Item>
                                </Col>
                                <Col span={4}>
                                  <Button type="link" danger onClick={() => removeArea(areaField.name)}>
                                    Eliminar
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ))}
                          <Button type="dashed" onClick={() => addArea()} size="small" block>
                            + Agregar Área
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Agregar Departamento
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      ),
    },
  ];

  const next = () => {
    if (currentStep === 0) {
      companyForm.validateFields().then(() => setCurrentStep(currentStep + 1));
    } else if (currentStep === 1) {
      managerForm.validateFields().then(() => setCurrentStep(currentStep + 1));
    } else {
      handleCreate();
    }
  };

  const prev = () => setCurrentStep(currentStep - 1);

  return (
    <Modal
      title="Crear Nueva Empresa"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Steps current={currentStep} size="small" style={{ marginBottom: 24 }}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>

      <div style={{ minHeight: 400 }}>
        {steps[currentStep].content}
      </div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
        {currentStep > 0 && (
          <Button onClick={prev}>
            Anterior
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Siguiente
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" onClick={handleCreate} loading={loading}>
            Crear Empresa
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default CreateCompanyModal;