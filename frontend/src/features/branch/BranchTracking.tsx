import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';
import { Wifi, MapPin, Clock } from 'lucide-react';
import clsx from 'clsx';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leafet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const mockPartners = [
  { id: '1', name: 'John Doe', lat: 34.0522, lng: -118.2437, trackingId: 'TRK-9021', status: 'Active', updated: '2 mins ago' },
  { id: '2', name: 'Jane Smith', lat: 34.0622, lng: -118.2537, trackingId: 'TRK-9022', status: 'Active', updated: 'Just now' },
];

export default function BranchTracking() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);

  const center: [number, number] = [34.0522, -118.2437]; // Los Angeles for demo

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-200">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between z-10">
        <h1 className="text-xl font-bold text-white">Live Tracking</h1>
        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full text-sm font-medium border border-green-500/20">
          <Wifi className="w-4 h-4" />
          <span>Live Connection Active</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-gray-900 border-r border-gray-800 overflow-y-auto z-10 md:static absolute bottom-0 max-h-[50vh] md:max-h-full rounded-t-2xl md:rounded-none shadow-2xl">
          <div className="p-4 border-b border-gray-800 sticky top-0 bg-gray-900">
            <h2 className="font-semibold text-white">Active Partners (2)</h2>
          </div>
          <div className="p-2 space-y-2">
            {mockPartners.map(partner => (
              <div 
                key={partner.id}
                onClick={() => setSelectedPartnerId(partner.id)}
                className={clsx(
                  "p-4 rounded-xl cursor-pointer transition-colors border",
                  selectedPartnerId === partner.id 
                    ? "bg-orange-500/10 border-orange-500/50" 
                    : "bg-gray-800 border-gray-700/50 hover:bg-gray-700"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{partner.name}</h3>
                  <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    {partner.status}
                  </span>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Current: {partner.trackingId}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Updated {partner.updated}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 bg-gray-800 relative z-0">
          <MapContainer 
            center={center} 
            zoom={13} 
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {mockPartners.map(partner => (
              <Marker key={partner.id} position={[partner.lat, partner.lng]}>
                <Popup className="custom-popup">
                  <div className="font-semibold text-gray-900">{partner.name}</div>
                  <div className="text-sm text-gray-600">{partner.trackingId}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
