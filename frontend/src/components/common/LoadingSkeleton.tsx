import React from 'react';

export const TicketTableSkeleton: React.FC = () => {
  return (
    <div className="space-y-3" role="status" aria-label="Loading tickets">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
            <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const StatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 bg-slate-200 rounded w-20"></div>
            <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
          </div>
          <div className="h-8 bg-slate-200 rounded w-14"></div>
        </div>
      ))}
    </div>
  );
};
