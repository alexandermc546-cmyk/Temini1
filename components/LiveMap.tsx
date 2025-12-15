import React, { useEffect, useRef } from 'react';
import { TrainDetails } from '../types';

interface LiveMapProps {
  train: TrainDetails | null;
}

const LiveMap: React.FC<LiveMapProps> = ({ train }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    // Access L from global window object injected via CDN
    const L = (window as any).L;
    
    if (!L || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // Center of India

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
    }

    if (train && train.coordinates) {
      const { lat, lng } = train.coordinates;
      
      // Update view
      mapInstance.current.setView([lat, lng], 10);

      // Custom icon
      const trainIcon = L.divIcon({
        html: `<div class="bg-blue-600 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.38 20A11.6 11.6 0 0 0 21 14V9c0-2.4-4-5-9-5S3 6.6 3 9v5c0 1.68.59 3.22 1.58 4.42"/><path d="M6 10h12"/><path d="M2.05 20H22"/></svg>
               </div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      if (markerInstance.current) {
        markerInstance.current.setLatLng([lat, lng]);
      } else {
        markerInstance.current = L.marker([lat, lng], { icon: trainIcon }).addTo(mapInstance.current);
      }
      
      markerInstance.current.bindPopup(`
        <b>${train.trainName} (${train.trainNumber})</b><br>
        Current: ${train.currentStation}<br>
        Status: ${train.status}
      `).openPopup();
    }

    return () => {
        // Cleanup if necessary
    };
  }, [train]);

  return <div ref={mapRef} className="w-full h-full min-h-[400px] bg-gray-100 rounded-xl overflow-hidden shadow-inner" />;
};

export default LiveMap;
