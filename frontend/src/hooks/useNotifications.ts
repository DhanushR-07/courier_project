import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { socketService } from '@/services/socketService';
import { notificationApi } from '@/services/mockApi';

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // Load initial notifications
    notificationApi.getForUser(userId).then(data => {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    });

    // Connect socket if needed
    if (!socketService.isConnected()) {
      socketService.connect('dummy-token');
    }

    const unsubscribe = socketService.subscribe(`user.${userId}.notifications`, (event) => {
      const newNotif = event.payload as Notification;
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const markAsRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    if (!userId) return;
    await notificationApi.markAllRead(userId);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markAsRead, markAllRead };
}
