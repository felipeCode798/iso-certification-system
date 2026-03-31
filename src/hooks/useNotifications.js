// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { message, notification } from 'antd';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simular conexión WebSocket para notificaciones en tiempo real
    const interval = setInterval(() => {
      // Aquí se recibirían notificaciones del servidor
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const showSuccess = useCallback((content, duration = 3) => {
    message.success(content, duration);
  }, []);

  const showError = useCallback((content, duration = 3) => {
    message.error(content, duration);
  }, []);

  const showWarning = useCallback((content, duration = 3) => {
    message.warning(content, duration);
  }, []);

  const showInfo = useCallback((content, duration = 3) => {
    message.info(content, duration);
  }, []);

  const showNotification = useCallback(({ title, description, type = 'info' }) => {
    notification[type]({
      message: title,
      description: description,
      placement: 'topRight',
    });
    
    const newNotification = {
      id: Date.now(),
      title,
      description,
      type,
      read: false,
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
};