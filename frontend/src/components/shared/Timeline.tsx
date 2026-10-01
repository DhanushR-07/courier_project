import React from 'react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import type { ShipmentTimeline, ShipmentStatus } from '@/types';

interface TimelineProps {
  events: ShipmentTimeline[];
  currentStatus: ShipmentStatus;
}

const ALL_STATUSES: ShipmentStatus[] = [
  'BOOKED',
  'PICKED_UP',
  'IN_TRANSIT',
  'AT_BRANCH',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

export const Timeline: React.FC<TimelineProps> = ({ events, currentStatus }) => {
  const currentStatusIndex = ALL_STATUSES.indexOf(currentStatus);
  const isFailed = currentStatus === 'FAILED_ATTEMPT';

  const getStatusLabel = (status: ShipmentStatus) => {
    switch (status) {
      case 'BOOKED': return 'Booked';
      case 'PICKED_UP': return 'Picked Up';
      case 'IN_TRANSIT': return 'In Transit';
      case 'AT_BRANCH': return 'At Branch';
      case 'OUT_FOR_DELIVERY': return 'Out for Delivery';
      case 'DELIVERED': return 'Delivered';
      case 'FAILED_ATTEMPT': return 'Failed Attempt';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col gap-0 py-4" aria-label="Shipment Timeline">
      {(isFailed ? [...ALL_STATUSES, 'FAILED_ATTEMPT' as ShipmentStatus] : ALL_STATUSES).map((status, index) => {
        if (isFailed && status === 'DELIVERED') return null; // Skip delivered if failed attempt
        if (!isFailed && status === 'FAILED_ATTEMPT') return null;
        
        const event = events.find(e => e.status === status) || 
                      (status === 'FAILED_ATTEMPT' ? events.find(e => e.status === 'FAILED_ATTEMPT') : null);
        
        const isCompleted = !!event && status !== 'FAILED_ATTEMPT';
        const isCurrent = status === currentStatus;
        const isLast = index === ALL_STATUSES.length - 1 || (isFailed && status === 'FAILED_ATTEMPT');

        return (
          <div key={status} className="relative flex gap-6 pb-8 last:pb-0">
            {/* Connecting line */}
            {!isLast && (
              <div
                className={clsx(
                  'absolute left-[11px] top-7 bottom-[-7px] w-[2px]',
                  isCompleted ? 'bg-orange-500' : 'bg-gray-700'
                )}
                aria-hidden="true"
              />
            )}

            {/* Dot */}
            <div className="relative flex flex-col items-center mt-1">
              <div
                className={clsx(
                  'w-6 h-6 rounded-full border-4 flex items-center justify-center z-10',
                  isCompleted || isCurrent ? 'border-gray-900 bg-orange-500' : 'border-gray-900 bg-gray-700',
                  status === 'FAILED_ATTEMPT' && 'bg-red-500'
                )}
              >
                {isCurrent && (
                  <div className={clsx(
                    'w-full h-full rounded-full animate-ping opacity-75',
                    status === 'FAILED_ATTEMPT' ? 'bg-red-500' : 'bg-orange-500'
                  )} />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
              <h4 className={clsx(
                'text-base font-medium',
                isCompleted || isCurrent ? 'text-white' : 'text-gray-500',
                status === 'FAILED_ATTEMPT' && 'text-red-500'
              )}>
                {getStatusLabel(status)}
              </h4>
              {event && (
                <div className="mt-1 flex flex-col gap-0.5 text-sm">
                  {event.location && <p className="text-gray-400">{event.location}</p>}
                  <p className="text-gray-500">{format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}</p>
                  {event.note && <p className="text-gray-400 italic mt-1">{event.note}</p>}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
