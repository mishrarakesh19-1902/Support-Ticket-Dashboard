import React from 'react';
import { TicketStats } from '../../types';
import { StatsCard } from '../common/StatsCard';
import { StatsSkeleton } from '../common/LoadingSkeleton';
import { Inbox, CircleDot, Clock, CheckCircle2 } from 'lucide-react';

interface StatsOverviewProps {
  stats: TicketStats | null;
  isLoading: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, isLoading }) => {
  if (isLoading && !stats) {
    return <StatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" aria-label="Support tickets statistics">
      <StatsCard
        title="Total Tickets"
        count={stats?.total}
        icon={Inbox}
        accentColor="indigo"
        isLoading={isLoading}
      />
      <StatsCard
        title="Open"
        count={stats?.open}
        icon={CircleDot}
        accentColor="blue"
        isLoading={isLoading}
      />
      <StatsCard
        title="In Progress"
        count={stats?.inProgress}
        icon={Clock}
        accentColor="amber"
        isLoading={isLoading}
      />
      <StatsCard
        title="Resolved"
        count={stats?.resolved}
        icon={CheckCircle2}
        accentColor="emerald"
        isLoading={isLoading}
      />
    </div>
  );
};
