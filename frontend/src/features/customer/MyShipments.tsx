import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';
import { Search, Package as PackageIcon, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export const MyShipments: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'ON_DELIVERY' | 'DELIVERED'>('ALL');
  const [search, setSearch] = useState('');

  const { data: shipments = [], isLoading } = useQuery({
    queryKey: ['customerShipmentsAll'],
    queryFn: () => mockApi.getShipments({}), 
  });

  const filteredShipments = shipments.filter(s => {
    if (search && !s.trackingId.toLowerCase().includes(search.toLowerCase())) return false;
    
    if (activeTab === 'PENDING') return ['BOOKED', 'PICKED_UP', 'AT_BRANCH'].includes(s.status);
    if (activeTab === 'ON_DELIVERY') return ['IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(s.status);
    if (activeTab === 'DELIVERED') return s.status === 'DELIVERED';
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Shipments</h1>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search by tracking ID..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({length: 6}).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse h-40"></div>
          ))
        ) : filteredShipments.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">No shipments found.</div>
        ) : (
          filteredShipments.map(shipment => (
            <div 
              key={shipment.id}
              onClick={() => navigate(`/customer/shipments/${shipment.id}`)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-gray-700 transition-colors group flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                    <PackageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium truncate max-w-[150px]">{shipment.packageName}</h3>
                    <p className="text-gray-500 text-xs">{shipment.trackingId}</p>
                  </div>
                </div>
                <span className={clsx(
                  "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                  shipment.status === 'DELIVERED' ? "bg-green-500/10 text-green-500" :
                  shipment.status === 'OUT_FOR_DELIVERY' ? "bg-orange-500/10 text-orange-500" :
                  "bg-blue-500/10 text-blue-500"
                )}>
                  {shipment.status.replace(/_/g, ' ')}
                </span>
              </div>
              
              <div className="mt-auto space-y-2 pt-4 border-t border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">From:</span>
                  <span className="text-gray-300 truncate max-w-[120px]">{shipment.senderName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">To:</span>
                  <span className="text-gray-300 truncate max-w-[120px]">{shipment.receiverName}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{format(new Date(shipment.bookingDate), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
