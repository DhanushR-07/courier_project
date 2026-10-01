import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { clsx } from 'clsx';

// Fix default icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: 'partner' | 'destination' | 'branch' | 'origin';
  popup?: string;
}

export interface MapRoute {
  points: [number, number][];
  color?: string;
}

export interface MapViewProps {
  markers: MapMarker[];
  routes?: MapRoute[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  showControls?: boolean;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

const createCustomIcon = (type: MapMarker['type']) => {
  const colors = {
    partner: '#f97316', // orange-500
    destination: '#3b82f6', // blue-500
    branch: '#22c55e', // green-500
    origin: '#a855f7', // purple-500
  };

  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: ${colors[type]}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

export const MapView: React.FC<MapViewProps> = ({
  markers,
  routes = [],
  center = [39.7392, -104.9903], // Default Denver
  zoom = 12,
  height = '400px',
  showControls = true,
  onMarkerClick,
  className
}) => {
  return (
    <div className={clsx('w-full rounded-2xl overflow-hidden border border-gray-800 z-0 relative', className)} style={{ height }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={showControls}
        zoomControl={showControls}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {routes.map((route, idx) => (
          <Polyline 
            key={`route-${idx}`} 
            positions={route.points} 
            color={route.color || '#f97316'} 
            weight={3} 
            opacity={0.8} 
            dashArray={route.color ? undefined : '5, 10'} // Dashed for non-custom routes
          />
        ))}

        {markers.map((marker) => (
          <Marker 
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createCustomIcon(marker.type)}
            eventHandlers={{
              click: () => onMarkerClick?.(marker.id)
            }}
          >
            {(marker.popup || marker.label) && (
              <Popup>
                <div className="font-medium text-gray-900">
                  {marker.label}
                </div>
                {marker.popup && <div className="text-sm text-gray-600 mt-1">{marker.popup}</div>}
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
