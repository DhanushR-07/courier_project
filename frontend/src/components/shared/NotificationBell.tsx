import React, { useState, useRef, useEffect } from 'react';
import { Bell, Package, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '@/types';
// Assuming useNotificationStore exists
// import { useNotificationStore } from '@/store/notificationStore';

// Mock store hook for standalone component (Replace with actual store import)
const useNotificationStore = () => {
  return {
    notifications: [] as Notification[],
    unreadCount: 0,
    markAllAsRead: () => {},
    markAsRead: (id: string) => {},
  };
};

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotificationStore();
  const recentNotifications = notifications.slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'STATUS_UPDATE': return <Package className="w-5 h-5 text-blue-500" />;
      case 'DELIVERY_ATTEMPT': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'OTP': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'ASSIGNMENT': return <Package className="w-5 h-5 text-orange-500" />;
      case 'SYSTEM': 
      default: return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-gray-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/90">
            <h3 className="font-medium text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs font-medium text-orange-500 hover:text-orange-400 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700/50">
                {recentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.isRead) markAsRead(notif.id);
                    }}
                    className={clsx(
                      'p-4 flex gap-3 hover:bg-gray-700/30 transition-colors cursor-pointer',
                      !notif.isRead && 'bg-gray-800/50'
                    )}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={clsx('text-sm font-medium truncate', !notif.isRead ? 'text-white' : 'text-gray-300')}>
                          {notif.title}
                        </p>
                        {!notif.isRead && <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-700 bg-gray-800/90 text-center">
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
