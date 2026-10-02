import React from 'react';
import { Priority } from '../../types';
import { cn } from '../../utils/cn';
import { AlertCircle, AlertTriangle, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
  showIcon?: boolean;
}

const config: Record<
  Priority,
  { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  HIGH: {
    label: 'High Priority',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    icon: AlertCircle,
  },
  MEDIUM: {
    label: 'Medium Priority',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: AlertTriangle,
  },
  LOW: {
    label: 'Low Priority',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: ArrowDown,
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className,
  showIcon = true,
}) => {
  const item = config[priority] || config.MEDIUM;
  const IconComponent = item.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        item.bg,
        item.text,
        item.border,
        className
      )}
      role="status"
      aria-label={item.label}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{priority}</span>
    </span>
  );
};
