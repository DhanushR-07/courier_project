import React from 'react';
import { clsx } from 'clsx';
import type { ShipmentStatus } from '@/types';

interface StatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const styles: Record<ShipmentStatus, { bg: string; text: string; label: string }> = {
    BOOKED: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Booked' },
    PICKED_UP: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', label: 'Picked Up' },
    IN_TRANSIT: { bg: 'bg-amber-500/10', text: 'text-amber-500', label: 'In Transit' },
    AT_BRANCH: { bg: 'bg-purple-500/10', text: 'text-purple-500', label: 'At Branch' },
    OUT_FOR_DELIVERY: { bg: 'bg-orange-500/10', text: 'text-orange-500', label: 'Out for Delivery' },
    DELIVERED: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Delivered' },
    FAILED_ATTEMPT: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Failed Attempt' },
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const currentStyle = styles[status] || { bg: 'bg-gray-500/10', text: 'text-gray-500', label: status };

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-medium',
        currentStyle.bg,
        currentStyle.text,
        sizeStyles[size]
      )}
      aria-label={`Status: ${currentStyle.label}`}
    >
      {currentStyle.label}
    </span>
  );
};
