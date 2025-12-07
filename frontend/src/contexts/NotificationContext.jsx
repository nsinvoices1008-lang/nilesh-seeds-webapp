import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { notificationAPI, chatAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { playNotificationSound, showBrowserNotification } from '../utils/helpers';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const response = await notificationAPI.get(user.userId);
      if (response.data.success) {
        setNotifications(response.data.notifications);
        const unread = response.data.notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
    }
  }, [user]);

  const fetchUnreadChatCount = useCallback(async () => {
    if (!user) return;

    try {
      const response = await chatAPI.getUnreadCount(user.userId);
      if (response.data.success) {
        setUnreadChatCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Fetch unread chat count error:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadChatCount();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications();
        fetchUnreadChatCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications, fetchUnreadChatCount]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationAPI.delete(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Delete notification error:', error);
    }
  };

  const showNotification = (message, type = 'info') => {
    toast[type](message);
    playNotificationSound();
    
    if (type === 'info' || type === 'success') {
      showBrowserNotification('निलेश सीड्स', { body: message });
    }
  };

  const value = {
    notifications,
    unreadCount,
    unreadChatCount,
    fetchNotifications,
    fetchUnreadChatCount,
    markAsRead,
    deleteNotification,
    showNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
