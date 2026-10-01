import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { ClipboardList, MapPin, Bell, User as UserIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '@/stores/authStore';

export const DeliveryLayout: React.FC = () => {
  const { user } = useAuthStore();
  
  // Dummy connection status
  const isConnected = true;

  const navItems = [
    { to: '/delivery', icon: ClipboardList, label: 'Today', end: true },
    { to: '/delivery/map', icon: MapPin, label: 'Map' },
    { to: '/delivery/notifications', icon: Bell, label: 'Notifications' },
    { to: '/delivery/profile', icon: UserIcon, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      {/* Minimal Top bar */}
      <header className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-orange-500">CourierFlow</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={clsx("w-2 h-2 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")}></span>
            <span className="text-xs text-gray-400">{isConnected ? 'Online' : 'Offline'}</span>
          </div>
          <NavLink to="/delivery/notifications" className="text-gray-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
          </NavLink>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative pb-16">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around items-center p-2 z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center p-2 rounded-lg transition-colors w-16',
                isActive ? 'text-orange-500' : 'text-gray-400'
              )
            }
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
