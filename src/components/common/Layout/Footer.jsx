// src/components/common/Layout/Footer.jsx
import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

export const Footer = () => {
  return (
    <AntFooter style={{ textAlign: 'center' }}>
      Sistema de Gestión ISO ©{new Date().getFullYear()} - Certificación y Recertificación
    </AntFooter>
  );
};