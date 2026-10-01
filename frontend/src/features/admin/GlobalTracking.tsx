import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Activity, MapPin, Truck, Navigation, ChevronRight, X } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const truckIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Mock hooks to replace actual data fetching
const useLiveTracking = () => {
  const [locations, setLocations] = useState([
    { id: '1', partnerName: 'John Doe', trackingId: 'TRK12345', status: 'IN_TRANSIT', branch: 'NY1', lat: 40.7128, lng: -74.0060, lastUpdate: new Date().toISOString() },
    { id: '2', partnerName: 'Jane Smith', trackingId: 'TRK12346', status: 'OUT_FOR_DELIVERY', branch: 'LA1', lat: 34.0522, lng: -118.2437, lastUpdate: new Date().toISOString() },
    { id: '3', partnerName: 'Mike Johnson', trackingId: 'TRK12347', status: 'IN_TRANSIT', branch: 'CHI1', lat: 41.8781, lng: -87.6298, lastUpdate: new Date().toISOString() },
  ]);

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setLocations(prev => prev.map(loc => ({
        ...loc,
        lat: loc.lat + (Math.random() - 0.5) * 0.01,
        lng: loc.lng + (Math.random() - 0.5) * 0.01,
        lastUpdate: new Date().toISOString()
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return { activeDeliveries: locations };
};

export const GlobalTracking = () => {
  const { activeDeliveries } = useLiveTracking();
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]); // US Center
  const [mapZoom, setMapZoom] = useState(4);

  const filteredDeliveries = activeDeliveries.filter(d => {
    const matchesSearch = d.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.trackingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === '' || d.branch === branchFilter;
    const matchesStatus = statusFilter === '' || d.status === statusFilter;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleCenter = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setMapZoom(12);
    // In a real app we'd need a ref to the map to call flyTo, but changing key/center works for simple react-leaflet setup if we re-render MapContainer
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-gray-950 text-gray-100 overflow-hidden relative">
      {/* Map Area */}
      <div className="flex-1 relative h-full">
        <MapContainer 
          key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: '100%', width: '100%', backgroundColor: '#111827' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {filteredDeliveries.map(d => (
            <Marker key={d.id} position={[d.lat, d.lng]} icon={truckIcon}>
              <Popup className="dark-popup">
                <div className="text-gray-900 font-sans p-1">
                  <h3 className="font-bold text-sm mb-1">{d.partnerName}</h3>
                  <p className="text-xs text-gray-600 mb-1">ID: <span className="text-orange-600 font-medium">{d.trackingId}</span></p>
                  <p className="text-xs mb-2">Status: 
                    <span className={clsx("ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white", 
                      d.status === 'OUT_FOR_DELIVERY' ? "bg-yellow-500" : "bg-blue-500"
                    )}>
                      {d.status.replace(/_/g, ' ')}
                    </span>
                  </p>
                  <p className="text-[10px] text-gray-400">Updated: {format(new Date(d.lastUpdate), 'HH:mm:ss')}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Filters */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
          <div className="bg-gray-900/90 backdrop-blur border border-gray-700 p-3 rounded-2xl shadow-xl flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search partner or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500 w-48"
              />
            </div>
            <select 
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">All Branches</option>
              <option value="NY1">New York</option>
              <option value="LA1">Los Angeles</option>
              <option value="CHI1">Chicago</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">All Statuses</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            </select>
          </div>
          
          <div className="bg-gray-900/90 backdrop-blur border border-gray-700 px-4 py-2 rounded-xl shadow-xl inline-flex items-center space-x-2 text-sm w-max">
            <span className="flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-gray-300">Live Connection</span>
            <span className="text-gray-500 ml-2">|</span>
            <span className="text-white font-medium ml-2">{filteredDeliveries.length} Active</span>
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden absolute bottom-4 right-4 z-[1000] bg-orange-600 p-3 rounded-full shadow-lg text-white"
        >
          <Navigation className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Panel */}
      <div className={clsx(
        "absolute md:relative right-0 bottom-0 top-0 w-full md:w-96 bg-gray-900 border-l border-gray-800 z-[1001] flex flex-col transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Truck className="w-5 h-5 mr-2 text-orange-500" />
            Active Partners
          </h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-950">
          {filteredDeliveries.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No active deliveries match filters.</div>
          ) : (
            filteredDeliveries.map(d => (
              <div 
                key={d.id} 
                onClick={() => handleCenter(d.lat, d.lng)}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700 cursor-pointer hover:border-orange-500/50 hover:bg-gray-750 transition group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white group-hover:text-orange-400 transition">{d.partnerName}</h3>
                  <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold", 
                    d.status === 'OUT_FOR_DELIVERY' ? "bg-yellow-900/50 text-yellow-500" : "bg-blue-900/50 text-blue-400"
                  )}>
                    {d.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-sm text-gray-400 flex items-center mb-1">
                  <span className="text-gray-500 mr-2">ID:</span> {d.trackingId}
                </div>
                <div className="text-sm text-gray-400 flex items-center mb-3">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-500" /> Branch: {d.branch}
                </div>
                <div className="text-xs text-gray-500 flex justify-between items-center border-t border-gray-700 pt-2">
                  <span>Updated: {format(new Date(d.lastUpdate), 'HH:mm:ss')}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <style>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background: #f9fafb;
          color: #111827;
          border-radius: 0.75rem;
        }
        .dark-popup .leaflet-popup-tip {
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default GlobalTracking;
