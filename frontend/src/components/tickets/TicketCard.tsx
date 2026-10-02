import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { formatRelativeTime } from '../../utils/formatters';
import { Mail, ChevronRight, Clock } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="block bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            #{ticket.id}
          </span>
          <StatusBadge status={ticket.status} />
        </div>
        <PriorityBadge priority={ticket.priority} />
      </div>

      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5">
        {ticket.title}
      </h3>

      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 truncate max-w-[200px]">
          <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">{ticket.customerEmail}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatRelativeTime(ticket.createdAt)}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </div>
      </div>
    </Link>
  );
};
