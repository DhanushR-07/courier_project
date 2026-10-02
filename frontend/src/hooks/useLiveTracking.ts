import { useState, useEffect } from 'react';
import { socketService } from '@/services/socketService';
import { LocationUpdate, StatusUpdate, ShipmentStatus } from '@/types';

export function useLiveTracking(trackingId?: string) {
  const [location, setLocation] = useState<LocationUpdate | null>(null);
  const [status, setStatus] = useState<ShipmentStatus | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(socketService.isConnected());

  useEffect(() => {
    if (!trackingId) return;

    // Connect if not already connected (mock token)
    if (!socketService.isConnected()) {
      socketService.connect('dummy-token').then(() => setIsConnected(true));
    } else {
      setIsConnected(true);
    }

    const unsubLocation = socketService.subscribe(`shipment.${trackingId}.location`, (event) => {
      const loc = event.payload as LocationUpdate;
      setLocation(loc);
      // Rough ETA simulation based on random logic
      const randomMins = Math.floor(Math.random() * 30) + 10;
      setEta(`${randomMins} mins`);
    });

    const unsubStatus = socketService.subscribe(`shipment.${trackingId}.status`, (event) => {
      const stat = event.payload as StatusUpdate;
      setStatus(stat.newStatus);
    });

    return () => {
      unsubLocation();
      unsubStatus();
    };
  }, [trackingId]);

  return { location, status, eta, isConnected };
}
