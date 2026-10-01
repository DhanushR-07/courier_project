import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';
import { useAuthStore } from '@/stores/authStore';
import { Search, ChevronRight, Package as PackageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { ShipmentStatus } from '@/types';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'ON_DELIVERY' | 'DELIVERED'>('ALL');
  const [search, setSearch] = useState('');

  const { data: shipments = [], isLoading } = useQuery({
    queryKey: ['customerShipments', user?.id],
    queryFn: () => mockApi.getShipments({}), // In real app, pass userId filter
  });

  // Only show active shipment details if the user searches for a matching receipt/tracking number
  const activeShipment = search
    ? shipments.find(s => s.trackingId.toLowerCase().includes(search.toLowerCase()))
    : null;

  const filteredShipments = shipments.filter(s => {
    // We remove the search text filter from the "Recent Your Shipment" list 
    // so it always shows the recent list, while the search controls the "Current Shipping" card above.
    // OR we can keep the search filtering the list too. The prompt said "current shipment only show after entering the recepit code number"
    // Let's filter the list too, so the list matches the search if they type.
    if (search && !s.trackingId.toLowerCase().includes(search.toLowerCase())) return false;
    
    if (activeTab === 'PENDING') return ['BOOKED', 'PICKED_UP', 'AT_BRANCH'].includes(s.status);
    if (activeTab === 'ON_DELIVERY') return ['IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(s.status);
    if (activeTab === 'DELIVERED') return s.status === 'DELIVERED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Greeting Section is handled partly in layout, but we can have it here if full content */}
      <div className="md:hidden pt-2">
        {/* Empty as mobile layout has greeting in top bar */}
      </div>

      {/* Current Shipping Card */}
      {activeShipment && (
        <section>
          <h3 className="text-lg font-semibold text-white mb-4">Current Shipping</h3>
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-6 shadow-lg relative overflow-hidden">
             {/* Decorative element */}
             <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             
             <div className="relative z-10 flex justify-between items-start">
               <div>
                 <span className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mb-3 backdrop-blur-sm border border-white/10">
                   {activeShipment.trackingId}
                 </span>
                 <h2 className="text-2xl font-bold text-white mb-1">{activeShipment.packageName}</h2>
                 <p className="text-orange-100 text-sm">Status: {activeShipment.status.replace(/_/g, ' ')}</p>
               </div>
               <button 
                 onClick={() => navigate(`/customer/shipments/${activeShipment.id}`)}
                 className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
               >
                 <ChevronRight className="w-5 h-5" />
               </button>
             </div>
          </div>
        </section>
      )}

      {/* Recent Shipments */}
      <section>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Your Shipment</h3>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Enter receipt number" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {(['ALL', 'PENDING', 'ON_DELIVERY', 'DELIVERED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab 
                  ? "bg-orange-500 text-white" 
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {tab === 'ON_DELIVERY' ? 'On Delivery' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({length: 3}).map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-4 animate-pulse h-20"></div>
            ))
          ) : filteredShipments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No shipments found.</div>
          ) : (
            filteredShipments.map(shipment => (
              <div 
                key={shipment.id}
                onClick={() => navigate(`/customer/shipments/${shipment.id}`)}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center cursor-pointer hover:border-gray-700 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mr-4 shrink-0">
                  <PackageIcon className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{shipment.packageName}</h4>
                  <p className="text-gray-500 text-sm truncate">{shipment.trackingId}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 ml-2 shrink-0" />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
