import React from 'react';
import { Priority, Status, SortOrder } from '../../types';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface TicketFiltersProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  status: Status | '';
  onStatusChange: (status: Status | '') => void;
  priority: Priority | '';
  onPriorityChange: (priority: Priority | '') => void;
  sort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
  onClearFilters,
  isFiltered,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="lg:col-span-5 relative">
          <label htmlFor="search-tickets" className="sr-only">
            Search tickets by title or customer email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="search-tickets"
              type="text"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title or email..."
              className="w-full pl-10 pr-9 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-2.5">
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as Status | '')}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="lg:col-span-2.5">
          <label htmlFor="priority-filter" className="sr-only">
            Filter by priority
          </label>
          <select
            id="priority-filter"
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as Priority | '')}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="lg:col-span-2">
          <label htmlFor="sort-filter" className="sr-only">
            Sort by creation date
          </label>
          <select
            id="sort-filter"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOrder)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Filter Active Indicator & Quick Reset */}
      {isFiltered && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>Filters active</span>
          </div>
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
