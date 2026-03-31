// src/pages/Login/LoginPage.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Tabs, Checkbox, Row, Col, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined, FileTextOutlined, AuditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text, Link } = Typography;
const { TabPane } = Tabs;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    // Simular login - En producción conectar con API real
    setTimeout(() => {
      if (values.email === 'admin@iso.com' && values.password === 'admin123') {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify({ 
          name: 'Administrador', 
          email: values.email, 
          role: 'admin' 
        }));
        message.success('Bienvenido al Sistema de Gestión ISO');
        navigate('/');
      } else {
        message.error('Credenciales incorrectas');
      }
      setLoading(false);
    }, 1000);
  };

  const handleRegister = async (values) => {
    setLoading(true);
    setTimeout(() => {
      message.success('Registro exitoso. Por favor inicie sesión.');
      setLoading(false);
    }, 1000);
  };

  const handleForgotPassword = () => {
    message.info('Se enviará un enlace a su correo para restablecer la contraseña');
  };

  return (
    <div className="login-container" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Row gutter={[48, 48]} style={{ width: '100%', maxWidth: '1200px' }}>
        {/* Columna izquierda - Información */}
        <Col xs={24} lg={12}>
          <div style={{ color: 'white', padding: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <SafetyOutlined style={{ fontSize: '48px', marginRight: '16px' }} />
              <Title level={1} style={{ color: 'white', margin: 0 }}>
                ISO Certification System
              </Title>
            </div>
            
            <Title level={3} style={{ color: 'white', marginBottom: '24px' }}>
              Sistema Integrado de Gestión
            </Title>
            
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', display: 'block', marginBottom: '32px' }}>
              Plataforma completa para la gestión, certificación y recertificación de sistemas de calidad.
            </Text>

            <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

            <div style={{ marginTop: '32px' }}>
              <Row gutter={[16, 16]}>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <FileTextOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                  <div>
                    <Text strong style={{ color: 'white' }}>ISO 9001</Text>
                    <br />
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Calidad</Text>
                  </div>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <SafetyOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                  <div>
                    <Text strong style={{ color: 'white' }}>ISO 27001</Text>
                    <br />
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Seguridad</Text>
                  </div>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <AuditOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                  <div>
                    <Text strong style={{ color: 'white' }}>ISO 20000</Text>
                    <br />
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Servicios TI</Text>
                  </div>
                </Col>
              </Row>
            </div>

            <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', marginTop: '32px' }} />

            <div style={{ marginTop: '24px' }}>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                © 2024 Sistema de Gestión ISO. Todos los derechos reservados.
              </Text>
            </div>
          </div>
        </Col>

        {/* Columna derecha - Formulario de Login */}
        <Col xs={24} lg={12}>
          <Card 
            style={{ 
              borderRadius: '16px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <Title level={3} style={{ marginTop: '16px', marginBottom: '8px' }}>
                Bienvenido
              </Title>
              <Text type="secondary">
                Ingrese sus credenciales para acceder al sistema
              </Text>
            </div>

            <Tabs defaultActiveKey="login" centered>
              <TabPane tab="Iniciar Sesión" key="login">
                <Form
                  name="login"
                  onFinish={handleLogin}
                  layout="vertical"
                  size="large"
                >
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Por favor ingrese su email' },
                      { type: 'email', message: 'Email inválido' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Email"
                      defaultValue="admin@iso.com"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Contraseña"
                      defaultValue="admin123"
                    />
                  </Form.Item>

                  <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Checkbox>Recordarme</Checkbox>
                      <Link onClick={handleForgotPassword}>¿Olvidó su contraseña?</Link>
                    </div>
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      block
                      size="large"
                    >
                      Iniciar Sesión
                    </Button>
                  </Form.Item>

                  <Divider plain>Demo</Divider>
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">Email: admin@iso.com | Contraseña: admin123</Text>
                  </div>
                </Form>
              </TabPane>

              <TabPane tab="Registrarse" key="register">
                <Form
                  name="register"
                  onFinish={handleRegister}
                  layout="vertical"
                  size="large"
                >
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
                  >
                    <Input 
                      prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Nombre completo"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Por favor ingrese su email' },
                      { type: 'email', message: 'Email inválido' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Email"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Por favor ingrese su contraseña' },
                      { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Contraseña"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Por favor confirme su contraseña' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Las contraseñas no coinciden'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Confirmar contraseña"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      block
                      size="large"
                    >
                      Registrarse
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;