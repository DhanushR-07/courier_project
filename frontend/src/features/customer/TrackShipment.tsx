import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mockApi } from '@/services/mockApi';

export default function TrackShipment() {
  const [trackingId, setTrackingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setIsSearching(true);
    try {
      // Just check if it exists before navigating
      await mockApi.getShipmentByTrackingId(trackingId.trim());
      navigate(`/customer/tracking/${trackingId.trim()}`);
    } catch (error) {
      toast.error('Shipment not found. Please check your tracking number.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Track Your Shipment</h1>
        <p className="text-gray-400">Enter your tracking number to get real-time location updates.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleTrack} className="relative z-10">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Tracking Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g. V789456AR123"
                className="w-full bg-gray-950 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-lg text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600 font-medium"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSearching}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-70 flex justify-center items-center gap-2 text-lg"
          >
            {isSearching ? 'Searching...' : 'Track Package'}
          </button>
        </form>

        <div className="mt-8 border-t border-gray-800 pt-6">
          <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" /> Try testing with these demo IDs:
          </h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setTrackingId('V789456AR123')} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors border border-gray-700">V789456AR123</button>
            <button onClick={() => setTrackingId('V789456AR124')} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors border border-gray-700">V789456AR124</button>
          </div>
        </div>
      </div>
    </div>
  );
}
