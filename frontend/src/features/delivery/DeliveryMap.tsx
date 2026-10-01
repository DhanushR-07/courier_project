import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation } from 'lucide-react';

// Fix leafet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const myLocation: [number, number] = [34.0522, -118.2437];
const deliveries = [
  { id: 1, name: 'Sarah Connor', lat: 34.0622, lng: -118.2537, address: '123 Cyberdyne Blvd' },
  { id: 2, name: 'John Smith', lat: 34.0722, lng: -118.2337, address: '456 Main St' },
];

export default function DeliveryMap() {
  const routePositions: [number, number][] = [
    myLocation,
    ...deliveries.map(d => [d.lat, d.lng] as [number, number])
  ];

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      <div className="p-4 bg-gray-900 border-b border-gray-800 z-10 pt-12">
        <h1 className="text-xl font-bold text-white">Route Map</h1>
        <p className="text-sm text-gray-400">2 stops remaining</p>
      </div>

      <div className="flex-1 relative z-0">
        <MapContainer 
          center={myLocation} 
          zoom={13} 
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* My Location */}
          <Marker position={myLocation}>
            <Popup>Current Location</Popup>
          </Marker>

          {/* Delivery Stops */}
          {deliveries.map((d) => (
            <Marker key={d.id} position={[d.lat, d.lng]}>
              <Popup className="custom-popup">
                <div className="font-bold text-gray-900">{d.name}</div>
                <div className="text-sm text-gray-600 mb-2">{d.address}</div>
                <button className="w-full bg-orange-500 text-white py-1 rounded text-sm font-medium">
                  View Details
                </button>
              </Popup>
            </Marker>
          ))}

          {/* Route Line */}
          <Polyline positions={routePositions} color="#f97316" weight={3} dashArray="5, 10" />
        </MapContainer>
        
        {/* Floating Action Button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-4">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-colors">
            <Navigation className="w-5 h-5" />
            Navigate to Next Stop
          </button>
        </div>
      </div>
    </div>
  );
}
