import React from 'react';
import { useNavigate } from 'react-router';
import { FileQuestion } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export const NotFoundPage: React.FC = () => {
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
          <div className="p-4 bg-gray-800 rounded-full border border-gray-700">
            <FileQuestion className="w-16 h-16 text-gray-400" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={handleRedirect}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-xl transition-colors"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};
