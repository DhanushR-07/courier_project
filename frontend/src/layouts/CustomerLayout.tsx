import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, MapPin, Bell, User as UserIcon, Moon, Sun, PlusCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '@/stores/authStore';

export const CustomerLayout: React.FC = () => {
  const { user } = useAuthStore();

  const navItems = [
    { to: '/customer', icon: LayoutDashboard, label: 'Home', end: true },
    { to: '/customer/shipments', icon: Package, label: 'Shipments' },
    { to: '/customer/book', icon: PlusCircle, label: 'Book' },
    { to: '/customer/track', icon: MapPin, label: 'Track' },
    { to: '/customer/notifications', icon: Bell, label: 'Notifications' },
    { to: '/customer/profile', icon: UserIcon, label: 'Profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-gray-900 border-r border-gray-800">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <UserIcon className="w-6 h-6 text-orange-500" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400">Hello,</p>
              <h2 className="text-lg font-bold text-white truncate">{user?.name || 'Guest'}</h2>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors',
                  isActive
                    ? 'bg-orange-500/10 text-orange-500 font-medium'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Top bar on Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5 text-orange-500" />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400">Hello,</p>
              <h2 className="text-sm font-bold text-white truncate">{user?.name || 'Guest'}</h2>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Top bar on Desktop */}
        <header className="hidden md:flex items-center justify-end p-4 bg-gray-950 border-b border-gray-800 z-10">
           <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Sun className="w-5 h-5" />
            </button>
            <Link to="/customer/notifications" className="text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="container mx-auto p-4 md:p-6 h-full">
            <Outlet />
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around items-center p-3 z-50">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center p-2 rounded-lg transition-colors',
                  isActive ? 'text-orange-500' : 'text-gray-400'
                )
              }
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
};
