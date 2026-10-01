import React, { useEffect, useState } from 'react';

export function useLocationTracker() {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setIsActive(true);
        setError(null);
        // In real app: mockApi.updateLocation(...)
        console.log('Location update:', position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setIsActive(false);
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { isActive, error };
}

export default function LocationTracker() {
  const { isActive, error } = useLocationTracker();

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 px-4 py-1.5 flex justify-center items-center z-50 text-xs">
      {error ? (
        <div className="flex items-center gap-2 text-red-400">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          Location error: {error}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-400">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
          Location sharing: {isActive ? 'Active' : 'Inactive'}
        </div>
      )}
    </div>
  );
}
