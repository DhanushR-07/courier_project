import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Building2, MapPin, ClipboardList, Bell, Search, Menu, X, Package as PackageIcon, LogOut, User as UserIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '@/stores/authStore';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/shipments', icon: Package, label: 'Shipments' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/branches', icon: Building2, label: 'Branches' },
    { to: '/admin/tracking', icon: MapPin, label: 'Tracking' },
    { to: '/admin/audit', icon: ClipboardList, label: 'Audit Log' },
    { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { to: '/admin/profile', icon: UserIcon, label: 'Profile' },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center space-x-2 text-orange-500">
            <PackageIcon className="w-8 h-8" />
            <span className="text-xl font-bold text-white">CourierFlow</span>
          </Link>
          <button className="md:hidden text-gray-400" onClick={closeMenu}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeMenu}
              className={({ isActive }) =>
                clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-orange-500/10 text-orange-500 border-l-2 border-orange-500'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
           <button onClick={logout} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white w-full transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Sign out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Top Header */}
        <header className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 z-10">
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden sm:flex relative items-center">
              <Search className="w-5 h-5 absolute left-3 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 transition-colors w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/admin/notifications" className="relative text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </Link>
            
            <Link to="/admin/profile" className="flex items-center space-x-2 border-l border-gray-800 pl-4 hover:opacity-80 transition-opacity">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
