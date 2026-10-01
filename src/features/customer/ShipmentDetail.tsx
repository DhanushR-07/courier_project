import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';
import { ArrowLeft, MapPin, Phone, User as UserIcon, Package as PackageIcon, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export const ShipmentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: shipment, isLoading } = useQuery({
    queryKey: ['shipment', id],
    queryFn: () => mockApi.getShipmentById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
  if (!shipment) return <div className="p-8 text-center text-red-500">Shipment not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-900 rounded-full text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Shipment Details</h1>
          <p className="text-sm text-gray-500">ID: {shipment.trackingId}</p>
        </div>
      </div>

      {/* Package Info Card */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
             <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
               <PackageIcon className="w-6 h-6 text-orange-500" />
             </div>
             <div>
               <h2 className="text-lg font-bold text-white">{shipment.packageName}</h2>
               <p className="text-sm text-gray-400">{shipment.packageType || 'Standard Package'} • {shipment.packageWeight || '1.0'} kg</p>
             </div>
          </div>
          <div className="text-right">
             <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-800 text-orange-500 border border-orange-500/30">
               {shipment.status.replace(/_/g, ' ')}
             </span>
          </div>
        </div>
      </div>

      {/* Sender / Receiver */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Sender</h3>
          <p className="text-white font-medium">{shipment.senderName}</p>
          <p className="text-sm text-gray-400 mt-1">{shipment.senderAddress}</p>
          <p className="text-sm text-gray-500 mt-2">{shipment.senderPhone}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Receiver</h3>
          <p className="text-white font-medium">{shipment.receiverName}</p>
          <p className="text-sm text-gray-400 mt-1">{shipment.receiverAddress}</p>
          <p className="text-sm text-gray-500 mt-2">{shipment.receiverPhone}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-6">Tracking History</h3>
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-800 before:to-transparent">
          {shipment.timeline.map((event, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-950 bg-gray-800 group-[.is-active]:bg-orange-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow absolute left-0 md:left-1/2 -translate-x-1/2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              {/* Content */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-10 md:ml-0 p-4 rounded-xl bg-gray-900 border border-gray-800 shadow">
                <div className="flex flex-col">
                  <span className="font-bold text-white mb-1">{event.status.replace(/_/g, ' ')}</span>
                  <span className="text-xs text-gray-500">{format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                  {event.location && <span className="text-sm text-gray-400 mt-2">{event.location}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OTP Section for Out for Delivery */}
      {shipment.status === 'OUT_FOR_DELIVERY' && shipment.deliveryOtp && (
        <div className="bg-orange-500/10 rounded-2xl p-6 border border-orange-500/20 text-center">
          <h3 className="text-orange-500 font-bold mb-2">Share this OTP with your delivery partner</h3>
          <div className="flex justify-center space-x-3 my-4">
            {shipment.deliveryOtp.split('').map((digit, i) => (
              <div key={i} className="w-12 h-14 bg-gray-900 border border-orange-500/50 rounded-lg flex items-center justify-center text-2xl font-bold text-orange-500 shadow-inner">
                {digit}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400">Do not share this OTP with anyone else.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="fixed md:static bottom-0 left-0 right-0 p-4 bg-gray-950 md:bg-transparent border-t border-gray-800 md:border-none z-40">
        <button 
          onClick={() => navigate(`/customer/track/${shipment.id}`)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-orange-500/20"
        >
          <MapPin className="w-5 h-5 mr-2" />
          Track Live
        </button>
      </div>
    </div>
  );
};
