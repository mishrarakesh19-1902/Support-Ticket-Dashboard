import React from 'react';
import { Status } from '../../types';
import { cn } from '../../utils/cn';
import { Clock, CheckCircle2, CircleDot } from 'lucide-react';

interface StatusBadgeProps {
  status: Status;
  className?: string;
  showIcon?: boolean;
}

const config: Record<
  Status,
  { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  OPEN: {
    label: 'Open',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: CircleDot,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: Clock,
  },
  RESOLVED: {
    label: 'Resolved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle2,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showIcon = true,
}) => {
  const item = config[status] || config.OPEN;
  const IconComponent = item.icon;

  const displayLabel = status === 'IN_PROGRESS' ? 'IN PROGRESS' : status;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        item.bg,
        item.text,
        item.border,
        className
      )}
      role="status"
      aria-label={`Status: ${item.label}`}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{displayLabel}</span>
    </span>
  );
};
