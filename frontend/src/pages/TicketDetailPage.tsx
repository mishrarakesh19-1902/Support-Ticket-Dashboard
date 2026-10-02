import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ticketApi, ApiError } from '../api/client';
import { Ticket, Priority, Status } from '../types';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { formatDateTime, formatRelativeTime } from '../utils/formatters';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Tag,
} from 'lucide-react';

export const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const ticketId = parseInt(id || '', 10);

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Edit states for PATCH
  const [selectedStatus, setSelectedStatus] = useState<Status>('OPEN');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('MEDIUM');
  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchTicket = useCallback(async () => {
    if (isNaN(ticketId) || ticketId <= 0) {
      setIsNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsNotFound(false);

    try {
      const data = await ticketApi.getTicketById(ticketId);
      setTicket(data);
      setSelectedStatus(data.status);
      setSelectedPriority(data.priority);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 404 || err.code === 'NOT_FOUND') {
          setIsNotFound(true);
        } else {
          setError(err);
        }
      } else {
        setError(new ApiError('Failed to fetch ticket details.', 500));
      }
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const hasChanges = ticket && (selectedStatus !== ticket.status || selectedPriority !== ticket.priority);

  const handleSaveChanges = async () => {
    if (!ticket || !hasChanges) return;

    setIsSaving(true);
    setSaveError(null);
    setSuccessNotice(null);

    try {
      const updated = await ticketApi.updateTicket(ticket.id, {
        status: selectedStatus,
        priority: selectedPriority,
      });

      setTicket(updated);
      setSelectedStatus(updated.status);
      setSelectedPriority(updated.priority);
      setSuccessNotice('Ticket updated successfully!');

      setTimeout(() => {
        setSuccessNotice(null);
      }, 4000);
    } catch (err) {
      if (err instanceof ApiError) {
        setSaveError(err.message);
      } else {
        setSaveError('Failed to update ticket. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDraft = () => {
    if (ticket) {
      setSelectedStatus(ticket.status);
      setSelectedPriority(ticket.priority);
      setSaveError(null);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6 space-y-6" role="status" aria-label="Loading ticket">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
        <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-2/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
            <div className="h-10 bg-slate-100 rounded"></div>
            <div className="h-10 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // 2. 404 Not Found State
  if (isNotFound || !ticket) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Ticket Not Found</h1>
        <p className="text-sm text-slate-600 mb-6">
          Ticket #{id} does not exist or may have been deleted.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ticket List</span>
        </Link>
      </div>
    );
  }

  // 3. Unexpected Error State
  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <ErrorAlert
          title="Could not load ticket details"
          message={error.message}
          details={error.details}
          onRetry={fetchTicket}
        />
        <div className="mt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all tickets</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tickets</span>
        </button>

        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          TICKET #{ticket.id}
        </span>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Save Error Banner */}
      {saveError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Main Ticket Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Header Info */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {ticket.title}
          </h1>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Customer Metadata Bar */}
          <div className="flex flex-wrap items-center gap-6 p-4 bg-slate-50 rounded-lg text-xs sm:text-sm text-slate-600 border border-slate-200/60">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-500">Customer:</span>
              <a
                href={`mailto:${ticket.customerEmail}`}
                className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                {ticket.customerEmail}
              </a>
            </div>

            <div className="flex items-center gap-2" title={formatDateTime(ticket.createdAt)}>
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-500">Created:</span>
              <span className="font-medium text-slate-700">
                {formatDateTime(ticket.createdAt)} ({formatRelativeTime(ticket.createdAt)})
              </span>
            </div>

            <div className="flex items-center gap-2" title={formatDateTime(ticket.updatedAt)}>
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-500">Last updated:</span>
              <span className="font-medium text-slate-700">
                {formatDateTime(ticket.updatedAt)} ({formatRelativeTime(ticket.updatedAt)})
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Issue Description
            </h2>
            <div className="p-5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-normal">
              {ticket.description}
            </div>
          </div>

          {/* Status & Priority Management Panel (PATCH Controls) */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                <span>Ticket Management</span>
              </h2>
              {hasChanges && (
                <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                  Unsaved changes
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status Selector */}
              <div>
                <label htmlFor="edit-status" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Update Status
                </label>
                <select
                  id="edit-status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as Status)}
                  disabled={isSaving}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                >
                  <option value="OPEN">Open (Waiting for support)</option>
                  <option value="IN_PROGRESS">In Progress (Agent investigating)</option>
                  <option value="RESOLVED">Resolved (Issue addressed)</option>
                </select>
              </div>

              {/* Priority Selector */}
              <div>
                <label htmlFor="edit-priority" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Update Priority
                </label>
                <select
                  id="edit-priority"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                  disabled={isSaving}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>
            </div>

            {/* Save & Reset Actions */}
            <div className="flex items-center justify-end gap-3 mt-5">
              {hasChanges && (
                <button
                  type="button"
                  onClick={handleResetDraft}
                  disabled={isSaving}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={!hasChanges || isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
