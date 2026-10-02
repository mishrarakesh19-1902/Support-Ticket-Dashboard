import React from 'react';
import { Inbox, RotateCcw, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  onCreateTicket?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tickets match your filters',
  description = 'Try adjusting your search criteria or filter options to find what you are looking for.',
  onClearFilters,
  onCreateTicket,
}) => {
  return (
    <div
      className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center my-6"
      role="region"
      aria-label="Empty search results"
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">{description}</p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear all filters</span>
          </button>
        )}
        {onCreateTicket && (
          <button
            type="button"
            onClick={onCreateTicket}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Ticket</span>
          </button>
        )}
      </div>
    </div>
  );
};
