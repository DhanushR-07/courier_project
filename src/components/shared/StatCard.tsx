import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; isUp: boolean };
  color?: 'orange' | 'green' | 'blue' | 'red' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'orange',
  onClick,
}) => {
  const colorMap = {
    orange: 'bg-orange-500/10 text-orange-500',
    green: 'bg-green-500/10 text-green-500',
    blue: 'bg-blue-500/10 text-blue-500',
    red: 'bg-red-500/10 text-red-500',
    purple: 'bg-purple-500/10 text-purple-500',
  };

  return (
    <div
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={clsx(
        'bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-700/50',
        onClick && 'cursor-pointer hover:bg-gray-800/80 transition-colors',
        'flex flex-col gap-4'
      )}
      aria-label={`${title} statistic: ${value}`}
    >
      <div className="flex items-center justify-between">
        <div className={clsx('p-3 rounded-xl flex items-center justify-center', colorMap[color])}>
          {icon}
        </div>
        {trend && (
          <div
            className={clsx(
              'flex items-center gap-1 text-sm font-medium',
              trend.isUp ? 'text-green-500' : 'text-red-500'
            )}
            aria-label={`Trend is ${trend.isUp ? 'up' : 'down'} by ${trend.value}%`}
          >
            {trend.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-gray-400 font-medium text-sm mb-1">{title}</h3>
        <p className="text-white font-bold text-3xl">{value}</p>
      </div>
    </div>
  );
};
