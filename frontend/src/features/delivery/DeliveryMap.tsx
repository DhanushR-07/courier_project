import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';
import { useAuthStore } from '@/stores/authStore';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix leafet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png', // truck icon
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function DeliveryMap() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: shipments, isLoading } = useQuery({
    queryKey: ['deliveryShipments'],
    queryFn: () => mockApi.getAllShipments({ partnerId: user?.id }),
    enabled: !!user?.id
  });

  const activeDeliveries = useMemo(() => {
    if (!shipments) return [];
    return shipments.filter(s => s.status === 'OUT_FOR_DELIVERY' || s.status === 'IN_TRANSIT');
  }, [shipments]);

  // Generate fake coordinates slightly offset from branch for the route
  const mapData = useMemo(() => {
    let baseLat = 39.7392;
    let baseLng = -104.9903;
    if (activeDeliveries.length > 0 && activeDeliveries[0].branch) {
      baseLat = activeDeliveries[0].branch.lat;
      baseLng = activeDeliveries[0].branch.lng;
    }
    const myLocation: [number, number] = [baseLat, baseLng];
    
    const deliveries = activeDeliveries.map((s, idx) => ({
      ...s,
      lat: baseLat + (idx + 1) * 0.005,
      lng: baseLng + (idx + 1) * 0.005,
    }));
    
    return { myLocation, deliveries };
  }, [activeDeliveries]);

  if (isLoading) return <div className="h-screen bg-gray-950 flex justify-center items-center"><Loader2 className="animate-spin text-orange-500 w-8 h-8" /></div>;

  const { myLocation, deliveries } = mapData;
  const routePositions: [number, number][] = [
    myLocation,
    ...deliveries.map(d => [d.lat, d.lng] as [number, number])
  ];

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      <div className="p-4 bg-gray-900 border-b border-gray-800 z-10 pt-12">
        <h1 className="text-xl font-bold text-white">Route Map</h1>
        <p className="text-sm text-gray-400">{deliveries.length} stops remaining</p>
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
          
          <Marker position={myLocation} icon={deliveryIcon}>
            <Popup>Current Location</Popup>
          </Marker>

          {deliveries.map((d) => (
            <Marker key={d.id} position={[d.lat, d.lng]}>
              <Popup className="custom-popup">
                <div className="font-bold text-gray-900">{d.receiverName}</div>
                <div className="text-sm text-gray-600 mb-2">{d.receiverAddress}</div>
                <button onClick={() => navigate(`/delivery/shipments/${d.id}`)} className="w-full bg-orange-500 text-white py-1 rounded text-sm font-medium">
                  View Details
                </button>
              </Popup>
            </Marker>
          ))}

          <Polyline positions={routePositions} color="#f97316" weight={3} dashArray="5, 10" />
        </MapContainer>
        
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
