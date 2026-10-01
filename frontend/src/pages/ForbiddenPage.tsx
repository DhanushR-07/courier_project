import React from 'react';
import { useNavigate } from 'react-router';
import { ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const handleRedirect = () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    } else {
      switch (user.role) {
        case 'CUSTOMER': return navigate('/customer');
        case 'ADMIN': return navigate('/admin');
        case 'BRANCH_STAFF': return navigate('/branch');
        case 'DELIVERY_PARTNER': return navigate('/delivery');
        default: return navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-orange-500/10 rounded-full">
            <ShieldAlert className="w-16 h-16 text-orange-500" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Access Denied</h2>
        <p className="text-gray-500 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <button
          onClick={handleRedirect}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-xl transition-colors"
        >
          {!isAuthenticated ? 'Go to Login' : 'Go to Dashboard'}
        </button>
      </div>
    </div>
  );
};
