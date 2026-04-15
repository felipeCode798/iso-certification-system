// src/components/modules/InitialSetup/InitialSetup.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Steps, 
  Form, 
  Input, 
  Select, 
  Button, 
  message, 
  Card, 
  Row, 
  Col, 
  Tag, 
  Alert, 
  Spin,
  Space,
  Divider,
  Tooltip,
  Progress,
  Empty
} from 'antd';
import { CheckOutlined, ExclamationOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';
import { usePermissions } from '../../../hooks/usePermissions';
import apiClient from '../../../services/api/apiClient';

const SETUP_STEPS = {
  COMPANY: 0,
  ORGANIZATION: 1,
  ROLES: 2,
  COMPLETION: 3,
};

const ISO_NORMS = [
  { value: 'iso9001', label: 'ISO 9001:2015 - Gestión de Calidad' },
  { value: 'iso27001', label: 'ISO 27001:2022 - Seguridad de Información' },
  { value: 'iso20000', label: 'ISO 20000:2018 - Servicios TI' },
];

const SECTORS = [
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'manufactura', label: 'Manufactura' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'salud', label: 'Salud' },
  { value: 'educacion', label: 'Educación' },
  { value: 'financiero', label: 'Financiero' },
  { value: 'otro', label: 'Otro' },
];

export const InitialSetup = ({ onComplete }) => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  
  // Estados principales
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [setupCompleted, setSetupCompleted] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(0);
  
  // Estados de formularios
  const [companyForm] = Form.useForm();
  const [orgForm] = Form.useForm();
  const [rolesForm] = Form.useForm();
  
  // Estados de datos guardados
  const [savedCompanyData, setSavedCompanyData] = useState(null);
  const [savedOrgData, setSavedOrgData] = useState(null);
  
  // Estados de errores
  const [errors, setErrors] = useState({
    company: null,
    organization: null,
    roles: null,
  });

  // Verificar si ya está configurado
  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/setup/status');
      
      if (response.data.isSetupComplete) {
        setSetupCompleted(true);
        setCompletionProgress(100);
        // Llamar onComplete después de un pequeño delay
        setTimeout(() => {
          onComplete?.();
        }, 1500);
      }
    } catch (error) {
      // Si no hay setup, continuar normalmente
      console.log('Setup no completado, continuando con configuración');
    } finally {
      setLoading(false);
    }
  };

  // Validar NIT colombiano
  const validateNIT = (nit) => {
    const cleanNIT = nit.replace(/[.\s-]/g, '');
    if (!/^\d{8,10}$/.test(cleanNIT)) {
      return false;
    }
    return true;
  };

  // Validar que al menos una norma ISO esté seleccionada
  const validateNorms = (norms) => {
    return norms && norms.length > 0;
  };

  // Paso 1: Configuración de Empresa
  const handleCompanySubmit = async (values) => {
    try {
      setLoading(true);
      setErrors(prev => ({ ...prev, company: null }));

      // Validaciones adicionales
      if (!validateNIT(values.nit)) {
        throw new Error('NIT inválido. Debe contener 8-10 dígitos');
      }

      if (!validateNorms(values.isoNorms)) {
        throw new Error('Debe seleccionar al menos una norma ISO');
      }

      const companyPayload = {
        nit: values.nit.replace(/[.\s-]/g, ''),
        businessName: values.businessName.trim(),
        tradeName: values.tradeName?.trim() || values.businessName.trim(),
        sector: values.sector,
        phone: values.phone?.trim(),
        address: values.address?.trim(),
        isoNorms: values.isoNorms,
      };

      const response = await apiClient.post('/companies', companyPayload);
      
      setSavedCompanyData(response.data);
      setCompletionProgress(25);
      message.success('Empresa registrada exitosamente. Continuando con estructura organizacional...');
      
      setTimeout(() => {
        setCurrentStep(SETUP_STEPS.ORGANIZATION);
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al registrar la empresa';
      setErrors(prev => ({ ...prev, company: errorMsg }));
      message.error(errorMsg);
      console.error('Error en empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Estructura Organizacional
  const handleOrgSubmit = async (values) => {
    try {
      setLoading(true);
      setErrors(prev => ({ ...prev, organization: null }));

      // Validación: al menos 1 departamento
      if (!values.departments || values.departments.length === 0) {
        throw new Error('Debe crear al menos un departamento');
      }

      // Validación: cada departamento debe tener al menos 1 área
      const invalidDepts = values.departments.filter(
        dept => !dept.name?.trim() || !dept.areas || dept.areas.length === 0
      );
      
      if (invalidDepts.length > 0) {
        throw new Error('Cada departamento debe tener al menos un nombre y una área');
      }

      const orgPayload = {
        companyId: savedCompanyData.id,
        departments: values.departments.map(dept => ({
          name: dept.name.trim(),
          description: dept.description?.trim(),
          areas: (dept.areas || []).map(area => ({
            name: area.name.trim(),
            description: area.description?.trim(),
          })),
        })),
      };

      const response = await apiClient.post('/organization/bulk', orgPayload);
      
      setSavedOrgData(response.data);
      setCompletionProgress(50);
      message.success('Estructura organizacional creada. Configurando roles y permisos...');
      
      setTimeout(() => {
        setCurrentStep(SETUP_STEPS.ROLES);
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al crear estructura';
      setErrors(prev => ({ ...prev, organization: errorMsg }));
      message.error(errorMsg);
      console.error('Error en organización:', error);
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: Roles y Permisos
  const handleRolesSubmit = async (values) => {
    try {
      setLoading(true);
      setErrors(prev => ({ ...prev, roles: null }));

      // Validación: al menos 1 rol
      if (!values.roles || values.roles.length === 0) {
        throw new Error('Debe crear al menos un rol');
      }

      const invalidRoles = values.roles.filter(role => !role.name?.trim());
      if (invalidRoles.length > 0) {
        throw new Error('Todos los roles deben tener un nombre');
      }

      const rolesPayload = {
        companyId: savedCompanyData.id,
        roles: values.roles.map(role => ({
          name: role.name.trim(),
          description: role.description?.trim(),
          type: 'custom',
        })),
      };

      await apiClient.post('/roles/bulk', rolesPayload);
      
      setCompletionProgress(100);
      setSetupCompleted(true);
      message.success('¡Configuración inicial completada exitosamente!');
      
      setTimeout(() => {
        onComplete?.();
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al configurar roles';
      setErrors(prev => ({ ...prev, roles: errorMsg }));
      message.error(errorMsg);
      console.error('Error en roles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Validar permisos
  if (!hasPermission('companies', 'create')) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Alert
          message="Permiso denegado"
          description="No tienes permisos para configurar el sistema. Contacta al administrador."
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Si ya está configurado
  if (setupCompleted) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Card style={{ maxWidth: 600, margin: '0 auto' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <CheckOutlined style={{ fontSize: 48, color: '#52c41a' }} />
            <h2>Configuración completada</h2>
            <p>Tu sistema de gestión ISO está listo para comenzar.</p>
            <Progress 
              type="circle" 
              percent={completionProgress} 
              width={120}
              format={percent => `${percent}%`}
            />
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 48 }} />}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>
        {/* Barra de progreso */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16} align="middle">
            <Col span={20}>
              <Progress 
                percent={completionProgress} 
                status={setupCompleted ? 'success' : 'active'}
              />
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 14, color: '#666' }}>
                {completionProgress}%
              </span>
            </Col>
          </Row>
        </Card>

        {/* Steps */}
        <Card style={{ marginBottom: 24 }}>
          <Steps current={currentStep} size="small">
            <Steps.Step 
              title="Empresa" 
              description="Datos básicos" 
              status={currentStep > 0 ? 'finish' : currentStep === 0 ? 'process' : 'wait'}
            />
            <Steps.Step 
              title="Estructura" 
              description="Organización" 
              status={currentStep > 1 ? 'finish' : currentStep === 1 ? 'process' : 'wait'}
            />
            <Steps.Step 
              title="Roles" 
              description="Permisos" 
              status={currentStep > 2 ? 'finish' : currentStep === 2 ? 'process' : 'wait'}
            />
            <Steps.Step 
              title="Completado" 
              description="Listo" 
              status={setupCompleted ? 'finish' : 'wait'}
            />
          </Steps>
        </Card>

        {/* Paso 0: Configuración de Empresa */}
        {currentStep === SETUP_STEPS.COMPANY && (
          <Card title="Paso 1: Configuración de Empresa" loading={loading}>
            {errors.company && (
              <Alert
                message="Error"
                description={errors.company}
                type="error"
                showIcon
                closable
                style={{ marginBottom: 16 }}
                onClose={() => setErrors(prev => ({ ...prev, company: null }))}
              />
            )}
            
            <Form 
              form={companyForm} 
              onFinish={handleCompanySubmit} 
              layout="vertical"
              requiredMark="optional"
            >
              <Alert
                message="Información importante"
                description="Complete los datos básicos de su empresa. Estos datos se utilizarán en todo el sistema de gestión ISO."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="nit"
                    label="NIT"
                    rules={[
                      { required: true, message: 'NIT requerido' },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          return validateNIT(value)
                            ? Promise.resolve()
                            : Promise.reject(new Error('NIT inválido (8-10 dígitos)'));
                        },
                      },
                    ]}
                  >
                    <Input 
                      placeholder="Ej: 900123456" 
                      maxLength={15}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="businessName"
                    label="Razón Social"
                    rules={[{ required: true, message: 'Razón social requerida' }]}
                  >
                    <Input 
                      placeholder="Nombre legal de la empresa"
                      maxLength={200}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item 
                name="tradeName" 
                label="Nombre Comercial (Opcional)"
              >
                <Input 
                  placeholder="Nombre con el que se conoce la empresa"
                  maxLength={200}
                />
              </Form.Item>

              <Form.Item
                name="isoNorms"
                label="Normas ISO a trabajar"
                rules={[
                  {
                    validator: (_, value) => {
                      return validateNorms(value)
                        ? Promise.resolve()
                        : Promise.reject(new Error('Seleccione al menos una norma ISO'));
                    },
                  },
                ]}
              >
                <Select 
                  mode="multiple" 
                  placeholder="Seleccione las normas a implementar"
                >
                  {ISO_NORMS.map(norm => (
                    <Select.Option key={norm.value} value={norm.value}>
                      {norm.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    name="sector" 
                    label="Sector Económico"
                    rules={[{ required: true, message: 'Sector requerido' }]}
                  >
                    <Select placeholder="Seleccione el sector">
                      {SECTORS.map(sector => (
                        <Select.Option key={sector.value} value={sector.value}>
                          {sector.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    name="phone" 
                    label="Teléfono (Opcional)"
                  >
                    <Input placeholder="+57 1 234 5678" maxLength={20} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item 
                name="address" 
                label="Dirección (Opcional)"
              >
                <Input.TextArea 
                  rows={2} 
                  placeholder="Dirección principal de la empresa"
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  loading={loading}
                >
                  Continuar →
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}

        {/* Paso 1: Estructura Organizacional */}
        {currentStep === SETUP_STEPS.ORGANIZATION && (
          <Card title="Paso 2: Estructura Organizacional" loading={loading}>
            {errors.organization && (
              <Alert
                message="Error"
                description={errors.organization}
                type="error"
                showIcon
                closable
                style={{ marginBottom: 16 }}
                onClose={() => setErrors(prev => ({ ...prev, organization: null }))}
              />
            )}

            <Form 
              form={orgForm} 
              onFinish={handleOrgSubmit} 
              layout="vertical"
            >
              <Alert
                message="Defina la estructura organizacional"
                description="Agregue los departamentos y áreas de su empresa. Cada departamento debe tener al menos un área."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Form.List name="departments">
                {(fields, { add, remove }) => (
                  <>
                    {fields.length === 0 && (
                      <Empty description="No hay departamentos agregados" />
                    )}
                    
                    {fields.map((field, index) => (
                      <Card
                        key={field.key}
                        title={
                          <Form.Item 
                            {...field}
                            name={[field.name, 'name']}
                            noStyle
                            rules={[{ required: true, message: 'Nombre requerido' }]}
                          >
                            <Input 
                              placeholder={`Departamento ${index + 1}`}
                              style={{ maxWidth: 300 }}
                            />
                          </Form.Item>
                        }
                        extra={
                          <Button 
                            type="link" 
                            danger 
                            onClick={() => remove(field.name)}
                          >
                            Eliminar
                          </Button>
                        }
                        style={{ marginBottom: 16 }}
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, 'description']}
                          label="Descripción (Opcional)"
                        >
                          <Input.TextArea rows={2} />
                        </Form.Item>

                        <Divider>Áreas del Departamento</Divider>

                        <Form.List name={[field.name, 'areas']}>
                          {(areaFields, { add: addArea, remove: removeArea }) => (
                            <>
                              {areaFields.length === 0 && (
                                <Alert 
                                  message="Agregue al menos un área a este departamento"
                                  type="warning"
                                  style={{ marginBottom: 16 }}
                                />
                              )}
                              
                              {areaFields.map((areaField, areaIndex) => (
                                <div key={areaField.key} style={{ marginBottom: 12, paddingLeft: 16, borderLeft: '2px solid #1890ff' }}>
                                  <Row gutter={8}>
                                    <Col span={20}>
                                      <Form.Item
                                        {...areaField}
                                        name={[areaField.name, 'name']}
                                        noStyle
                                        rules={[{ required: true, message: 'Nombre de área requerido' }]}
                                      >
                                        <Input 
                                          placeholder={`Área ${areaIndex + 1}`}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                      <Button 
                                        type="link" 
                                        danger
                                        block
                                        onClick={() => removeArea(areaField.name)}
                                      >
                                        Quitar
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>
                              ))}
                              
                              <Button 
                                type="dashed" 
                                onClick={() => addArea()} 
                                block
                                style={{ marginTop: 12 }}
                              >
                                + Agregar Área
                              </Button>
                            </>
                          )}
                        </Form.List>
                      </Card>
                    ))}
                    
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      block
                      style={{ marginBottom: 24 }}
                    >
                      + Agregar Departamento
                    </Button>
                  </>
                )}
              </Form.List>

              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button 
                  onClick={() => setCurrentStep(SETUP_STEPS.COMPANY)}
                >
                  ← Atrás
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={loading}
                >
                  Continuar →
                </Button>
              </Space>
            </Form>
          </Card>
        )}

        {/* Paso 2: Roles y Permisos */}
        {currentStep === SETUP_STEPS.ROLES && (
          <Card title="Paso 3: Roles y Permisos" loading={loading}>
            {errors.roles && (
              <Alert
                message="Error"
                description={errors.roles}
                type="error"
                showIcon
                closable
                style={{ marginBottom: 16 }}
                onClose={() => setErrors(prev => ({ ...prev, roles: null }))}
              />
            )}

            <Form 
              form={rolesForm} 
              onFinish={handleRolesSubmit} 
              layout="vertical"
            >
              <Alert
                message="Defina los roles del sistema"
                description="Los roles controlarán quién puede hacer qué en el sistema. Puede ajustar los permisos detallados después."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Form.List name="roles">
                {(fields, { add, remove }) => (
                  <>
                    {fields.length === 0 && (
                      <Empty description="No hay roles agregados" />
                    )}

                    {fields.map((field, index) => (
                      <Card
                        key={field.key}
                        title={
                          <Form.Item 
                            {...field}
                            name={[field.name, 'name']}
                            noStyle
                            rules={[{ required: true, message: 'Nombre requerido' }]}
                          >
                            <Input 
                              placeholder={`Rol ${index + 1}`}
                              style={{ maxWidth: 300 }}
                            />
                          </Form.Item>
                        }
                        extra={
                          <Button 
                            type="link" 
                            danger 
                            onClick={() => remove(field.name)}
                          >
                            Eliminar
                          </Button>
                        }
                        style={{ marginBottom: 16 }}
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, 'description']}
                          label="Descripción (Opcional)"
                        >
                          <Input.TextArea 
                            rows={2}
                            placeholder="Descripción de las responsabilidades del rol"
                          />
                        </Form.Item>
                      </Card>
                    ))}

                    <Button 
                      type="dashed" 
                      onClick={() => add({ name: '', description: '' })} 
                      block
                      style={{ marginBottom: 24 }}
                    >
                      + Agregar Rol
                    </Button>
                  </>
                )}
              </Form.List>

              <Alert
                message={
                  <Space>
                    <ExclamationOutlined />
                    Los permisos específicos pueden ser ajustados después de la configuración inicial.
                  </Space>
                }
                type="warning"
                style={{ marginBottom: 24 }}
              />

              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button 
                  onClick={() => setCurrentStep(SETUP_STEPS.ORGANIZATION)}
                >
                  ← Atrás
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={loading}
                >
                  Finalizar Configuración ✓
                </Button>
              </Space>
            </Form>
          </Card>
        )}
      </div>
    </Spin>
  );
};

export default InitialSetup;