import React from 'react';
import { clsx } from 'clsx';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={clsx('flex flex-col items-center justify-center p-8 text-center', className)}>
      {icon && (
        <div className="mb-4 text-gray-500 bg-gray-800/50 p-4 rounded-full">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      {description && <p className="text-gray-400 max-w-md mb-6">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
