import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';
import { ArrowLeft, Phone, User as UserIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leafet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png', // simple truck icon
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export const LiveTrackingPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: shipment, isLoading } = useQuery({
    queryKey: ['shipment', id],
    queryFn: () => mockApi.getShipmentById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="h-screen bg-gray-950 flex items-center justify-center text-white">Loading map...</div>;
  if (!shipment) return <div className="h-screen bg-gray-950 flex items-center justify-center text-red-500">Shipment not found</div>;

  // Mock coordinates for demo
  const origin: [number, number] = [40.7128, -74.0060]; // NY
  const destination: [number, number] = [40.7580, -73.9855]; // Times Square
  const currentLoc: [number, number] = [shipment.currentLat || 40.7300, shipment.currentLng || -73.9950];

  return (
    <div className="relative h-screen w-full bg-gray-950 overflow-hidden flex flex-col">
      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-gray-950/80 to-transparent pointer-events-none">
        <div className="flex items-center space-x-4 pointer-events-auto">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-900/80 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg border border-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-white font-bold text-sm">{shipment.packageName}</h2>
            <p className="text-gray-400 text-xs">{shipment.trackingId}</p>
          </div>
        </div>
      </div>

      {/* Connection Indicator */}
      <div className="absolute top-4 right-4 z-50 bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-800 flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-white">Live</span>
      </div>

      {/* Map */}
      <div className="flex-1 w-full z-0">
        <MapContainer 
          center={currentLoc} 
          zoom={13} 
          zoomControl={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <Marker position={origin}>
            <Popup>Origin</Popup>
          </Marker>
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>
          <Marker position={currentLoc} icon={deliveryIcon}>
            <Popup>Current Location</Popup>
          </Marker>
          <Polyline positions={[origin, destination]} color="#f97316" weight={3} dashArray="5, 10" />
        </MapContainer>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-gray-900 rounded-t-3xl border-t border-gray-800 shadow-2xl pb-safe">
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto my-3"></div>
        
        <div className="px-6 pb-6 pt-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-400 font-medium">Estimated Time</p>
              <p className="text-2xl font-bold text-white">15 - 20 Min</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 font-medium">Distance</p>
              <p className="text-lg font-bold text-white">2.4 km</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-2xl border border-gray-800">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-600">
                 <UserIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h4 className="text-white font-bold">{shipment.assignedPartnerName || 'Assigned Partner'}</h4>
                <p className="text-xs text-gray-400">Delivery Partner</p>
              </div>
            </div>
            <button className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white transition-colors shadow-lg shadow-green-500/10">
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
