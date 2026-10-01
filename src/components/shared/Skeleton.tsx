import React from 'react';
import { clsx } from 'clsx';

export const SkeletonLine: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={clsx('bg-gray-700 animate-pulse rounded', className || 'h-4 w-full')} />;
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('bg-gray-800 rounded-2xl p-6 border border-gray-700', className)}>
      <SkeletonLine className="w-12 h-12 rounded-xl mb-4" />
      <SkeletonLine className="h-4 w-1/3 mb-2" />
      <SkeletonLine className="h-8 w-1/2" />
    </div>
  );
};

export const SkeletonAvatar: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={clsx('bg-gray-700 animate-pulse rounded-full', className || 'w-10 h-10')} />;
};

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="bg-gray-800/80 p-4 border-b border-gray-800 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonLine key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-gray-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 bg-gray-900">
            {Array.from({ length: cols }).map((_, j) => (
              <SkeletonLine key={j} className="h-4 flex-1 max-w-[120px]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
