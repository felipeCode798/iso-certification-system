// src/components/common/Layout/Footer.jsx
import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter className="text-center bg-white border-t">
      <div className="container mx-auto px-4">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Space split={<Divider type="vertical" />}>
            <Text type="secondary">© {currentYear} Sistema de Gestión ISO</Text>
            <Text type="secondary">Versión 1.0.0</Text>
            <Text type="secondary">Certificación ISO 9001, 27001, 20000</Text>
          </Space>
          
          <Space split={<Divider type="vertical" />}>
            <Link href="mailto:support@iso-system.com">
              <MailOutlined /> soporte@iso-system.com
            </Link>
            <Link href="https://github.com" target="_blank">
              <GithubOutlined /> GitHub
            </Link>
            <Link href="https://linkedin.com" target="_blank">
              <LinkedinOutlined /> LinkedIn
            </Link>
          </Space>
          
          <Text type="secondary" className="text-xs">
            Sistema de gestión integrado para certificación y recertificación
          </Text>
        </Space>
      </div>
    </AntFooter>
  );
};

export default Footer;