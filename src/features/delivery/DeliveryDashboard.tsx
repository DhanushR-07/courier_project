import React from 'react';
import { Phone, MapPin, Navigation, RefreshCw, Package } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';

export default function DeliveryDashboard() {
  const handleNavigate = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 pb-20">
      {/* Header */}
      <div className="bg-gray-900 pt-12 pb-4 px-4 sticky top-0 z-10 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Today's Deliveries</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-gray-400">Location sharing: Active</span>
          </div>
        </div>
        <button className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white border border-gray-700">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="flex overflow-x-auto gap-3 p-4 snap-x no-scrollbar">
        <div className="snap-start min-w-[120px] bg-gray-800 rounded-2xl p-4 border border-gray-700/50">
          <div className="text-gray-400 text-xs mb-1">Total</div>
          <div className="text-2xl font-bold text-white">12</div>
        </div>
        <div className="snap-start min-w-[120px] bg-green-500/10 rounded-2xl p-4 border border-green-500/20">
          <div className="text-green-400 text-xs mb-1">Delivered</div>
          <div className="text-2xl font-bold text-green-500">5</div>
        </div>
        <div className="snap-start min-w-[120px] bg-orange-500/10 rounded-2xl p-4 border border-orange-500/20">
          <div className="text-orange-400 text-xs mb-1">Pending</div>
          <div className="text-2xl font-bold text-orange-500">7</div>
        </div>
      </div>

      {/* Delivery List */}
      <div className="px-4 space-y-4 pb-6">
        {[1,2,3].map((item) => (
          <div key={item} className="bg-gray-800 rounded-2xl p-5 border border-gray-700/50 shadow-sm relative overflow-hidden">
            {/* Status indicator line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Sarah Connor</h3>
                <p className="text-sm text-gray-400 flex items-start gap-1 max-w-[200px]">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-500" />
                  123 Cyberdyne Systems Blvd, Los Angeles, CA 90012
                </p>
              </div>
              <a 
                href="tel:555019283" 
                className="w-10 h-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center border border-green-500/30"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>

            <div className="bg-gray-900 rounded-xl p-3 mb-4 flex items-center justify-between border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Electronics Box</div>
                  <div className="text-xs text-gray-500">TRK-990212</div>
                </div>
              </div>
              <span className="text-xs bg-orange-500/20 text-orange-400 px-2.5 py-1 rounded-full font-medium">
                Pending
              </span>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => handleNavigate('123 Cyberdyne Systems Blvd')}
                className="flex-1 flex items-center justify-center gap-2 border border-orange-500 text-orange-500 font-semibold py-3 rounded-xl hover:bg-orange-500/10 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Navigate
              </button>
              <button className="flex-1 bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                Update Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
