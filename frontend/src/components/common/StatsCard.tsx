import React from 'react';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  count: number | undefined;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: 'blue' | 'amber' | 'emerald' | 'indigo';
  isLoading?: boolean;
}

const colorStyles = {
  blue: {
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
    hoverBorder: 'hover:border-blue-300',
  },
  amber: {
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
    hoverBorder: 'hover:border-amber-300',
  },
  emerald: {
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    hoverBorder: 'hover:border-emerald-300',
  },
  indigo: {
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    hoverBorder: 'hover:border-indigo-300',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  count,
  icon: Icon,
  accentColor,
  isLoading = false,
}) => {
  const styles = colorStyles[accentColor];

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 p-5 shadow-sm transition-all duration-200',
        styles.hoverBorder
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center border', styles.iconBg)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        {isLoading ? (
          <div className="h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {count ?? 0}
          </p>
        )}
      </div>
    </div>
  );
};
