import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  from: string;
  to: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  sendNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Convert timestamp strings back to Date objects
        const notificationsWithDates = parsed.map((n: Omit<Notification, 'timestamp'> & { timestamp: string }) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    } else {
      // Add sample notifications for demonstration
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          title: 'Welcome to Receipt Master!',
          message: 'Thank you for using our receipt management system. You can now send notifications to communicate with your team.',
          type: 'info',
          from: 'system',
          to: 'all',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          read: false,
          priority: 'medium'
        },
        {
          id: '2',
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur tonight at 2 AM. Please save your work.',
          type: 'warning',
          from: '1',
          to: 'all',
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          read: false,
          priority: 'high'
        }
      ];
      setNotifications(sampleNotifications);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Filter notifications for current user
  const userNotifications = notifications.filter(n => 
    n.to === user?.id || n.to === 'all' || n.from === user?.id
  );

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const sendNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    notifications: userNotifications,
    unreadCount,
    sendNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 