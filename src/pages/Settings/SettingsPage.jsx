// src/pages/Settings/SettingsPage.jsx
import React from 'react';
import { Card, Tabs, Form, Input, Button, Switch, Select } from 'antd';

const { TabPane } = Tabs;

const SettingsPage = () => {
  return (
    <div className="settings-page">
      <Card title="Configuración del Sistema">
        <Tabs defaultActiveKey="general">
          <TabPane tab="General" key="general">
            <Form layout="vertical">
              <Form.Item label="Nombre de la Organización">
                <Input placeholder="Nombre de la empresa" />
              </Form.Item>
              <Form.Item label="Normas ISO Activas">
                <Select mode="multiple" defaultValue={['iso9001', 'iso27001']}>
                  <Select.Option value="iso9001">ISO 9001:2015</Select.Option>
                  <Select.Option value="iso27001">ISO 27001:2022</Select.Option>
                  <Select.Option value="iso20000">ISO 20000:2018</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Idioma">
                <Select defaultValue="es">
                  <Select.Option value="es">Español</Select.Option>
                  <Select.Option value="en">English</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary">Guardar Cambios</Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="Notificaciones" key="notifications">
            <Form layout="vertical">
              <Form.Item label="Notificaciones por Email" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="Alertas de Auditorías" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="Recordatorios de Capacitación" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="Seguridad" key="security">
            <Form layout="vertical">
              <Form.Item label="Cambiar Contraseña">
                <Input.Password placeholder="Contraseña actual" />
              </Form.Item>
              <Form.Item>
                <Input.Password placeholder="Nueva contraseña" />
              </Form.Item>
              <Form.Item>
                <Input.Password placeholder="Confirmar nueva contraseña" />
              </Form.Item>
              <Form.Item>
                <Button type="primary">Actualizar Contraseña</Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsPage;