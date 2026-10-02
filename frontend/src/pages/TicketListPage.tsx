import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ticketApi, ApiError } from '../api/client';
import { Ticket, TicketStats, Priority, Status, SortOrder, PaginationMeta } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { StatsOverview } from '../components/tickets/StatsOverview';
import { TicketFilters } from '../components/tickets/TicketFilters';
import { TicketTable } from '../components/tickets/TicketTable';
import { TicketCard } from '../components/tickets/TicketCard';
import { Pagination } from '../components/common/Pagination';
import { TicketTableSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { Plus } from 'lucide-react';

export const TicketListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read URL query parameters
  const initialSearch = searchParams.get('search') || '';
  const initialStatus = (searchParams.get('status') as Status) || '';
  const initialPriority = (searchParams.get('priority') as Priority) || '';
  const initialSort = (searchParams.get('sort') as SortOrder) || 'newest';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // Local state for search input (debounced)
  const [searchInput, setSearchInput] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Filter and pagination state
  const [status, setStatus] = useState<Status | ''>(initialStatus);
  const [priority, setPriority] = useState<Priority | ''>(initialPriority);
  const [sort, setSort] = useState<SortOrder>(initialSort);
  const [page, setPage] = useState<number>(isNaN(initialPage) || initialPage < 1 ? 1 : initialPage);

  // Data state
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState<TicketStats | null>(null);

  // Loading & Error states
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const isInitialMount = useRef(true);

  // Synchronize state changes to URL search params
  const updateUrlParams = useCallback(
    (newSearch: string, newStatus: Status | '', newPriority: Priority | '', newSort: SortOrder, newPage: number) => {
      const params = new URLSearchParams();
      if (newSearch.trim()) params.set('search', newSearch.trim());
      if (newStatus) params.set('status', newStatus);
      if (newPriority) params.set('priority', newPriority);
      if (newSort !== 'newest') params.set('sort', newSort);
      if (newPage > 1) params.set('page', newPage.toString());

      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  // Fetch Dataset-wide Stats
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const data = await ticketApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Fetch Tickets matching current query
  const fetchTickets = useCallback(async () => {
    setIsLoadingTickets(true);
    setError(null);
    try {
      const response = await ticketApi.getTickets({
        search: debouncedSearch,
        status,
        priority,
        sort,
        page,
      });
      setTickets(response.data);
      setPagination(response.pagination);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(new ApiError('Failed to load tickets. Please try again.', 500));
      }
    } finally {
      setIsLoadingTickets(false);
    }
  }, [debouncedSearch, status, priority, sort, page]);

  // Initial stats fetch on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Fetch tickets whenever query dependencies change
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Sync to URL whenever query filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    updateUrlParams(debouncedSearch, status, priority, sort, page);
  }, [debouncedSearch, status, priority, sort, page, updateUrlParams]);

  // Handlers that reset page to 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleStatusChange = (newStatus: Status | '') => {
    setStatus(newStatus);
    setPage(1);
  };

  const handlePriorityChange = (newPriority: Priority | '') => {
    setPriority(newPriority);
    setPage(1);
  };

  const handleSortChange = (newSort: SortOrder) => {
    setSort(newSort);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setStatus('');
    setPriority('');
    setSort('newest');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFiltered = !!(debouncedSearch || status || priority || sort !== 'newest');

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Support Tickets
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, filter, and track customer support requests
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/tickets/new')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Dataset Overview Stats */}
      <StatsOverview stats={stats} isLoading={isLoadingStats} />

      {/* Search and Filters Bar */}
      <TicketFilters
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        priority={priority}
        onPriorityChange={handlePriorityChange}
        sort={sort}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
      />

      {/* Error Alert */}
      {error && (
        <ErrorAlert
          title="Could not load tickets"
          message={error.message}
          details={error.details}
          onRetry={fetchTickets}
        />
      )}

      {/* Main Ticket List State / Content */}
      {isLoadingTickets ? (
        <TicketTableSkeleton />
      ) : tickets.length === 0 ? (
        <EmptyState
          title={isFiltered ? 'No tickets match your filters' : 'No support tickets found'}
          description={
            isFiltered
              ? 'Try changing your search term, clearing status or priority filters.'
              : 'There are currently no tickets in the system. Create your first support ticket to get started.'
          }
          onClearFilters={isFiltered ? handleClearFilters : undefined}
          onCreateTicket={() => navigate('/tickets/new')}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <TicketTable tickets={tickets} />
          </div>

          {/* Mobile Stacked Cards View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>

          {/* Server-driven Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
            isLoading={isLoadingTickets}
          />
        </div>
      )}
    </div>
  );
};
