import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';
import { Bell, Package, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { NotificationType } from '@/types';

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'STATUS_UPDATE': return <Package className="w-5 h-5 text-blue-500" />;
    case 'DELIVERY_ATTEMPT': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case 'OTP': return <ShieldCheck className="w-5 h-5 text-green-500" />;
    default: return <Bell className="w-5 h-5 text-gray-400" />;
  }
};

export const NotificationHistory: React.FC = () => {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => mockApi.getNotifications(''), // Pass userId in real app
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <button className="text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({length: 5}).map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-4 animate-pulse h-24"></div>
          ))
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-12 flex flex-col items-center">
            <Bell className="w-12 h-12 text-gray-700 mb-4" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id}
              className={clsx(
                "p-4 rounded-xl border flex gap-4 transition-colors",
                notification.isRead 
                  ? "bg-gray-900 border-gray-800" 
                  : "bg-gray-800/50 border-orange-500/20"
              )}
            >
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                notification.isRead ? "bg-gray-800" : "bg-gray-800 border border-orange-500/20"
              )}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className={clsx("font-medium truncate", notification.isRead ? "text-gray-300" : "text-white")}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                    {format(new Date(notification.createdAt), 'MMM d, HH:mm')}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-2"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
