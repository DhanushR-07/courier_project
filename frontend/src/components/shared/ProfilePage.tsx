import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { UserCircle, Mail, Phone, Building2, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Profile Settings</h1>
      
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <UserCircle className="w-12 h-12 text-orange-500" />
            )}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <div className="inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-gray-800 text-xs font-medium text-orange-400">
              <Shield className="w-3 h-3" />
              {user.role.replace(/_/g, ' ')}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-4">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-400 mb-1">
              <UserCircle className="w-4 h-4 mr-2" /> Full Name
            </label>
            <p className="text-white font-medium bg-gray-800/50 px-4 py-2.5 rounded-xl border border-gray-700/50">{user.name}</p>
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-400 mb-1">
              <Mail className="w-4 h-4 mr-2" /> Email Address
            </label>
            <p className="text-white font-medium bg-gray-800/50 px-4 py-2.5 rounded-xl border border-gray-700/50">{user.email}</p>
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-gray-400 mb-1">
              <Phone className="w-4 h-4 mr-2" /> Phone Number
            </label>
            <p className="text-white font-medium bg-gray-800/50 px-4 py-2.5 rounded-xl border border-gray-700/50">{user.phone}</p>
          </div>
          
          {user.branchId && (
            <div>
              <label className="flex items-center text-sm font-medium text-gray-400 mb-1">
                <Building2 className="w-4 h-4 mr-2" /> Branch ID
              </label>
              <p className="text-white font-medium bg-gray-800/50 px-4 py-2.5 rounded-xl border border-gray-700/50">{user.branchId}</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
