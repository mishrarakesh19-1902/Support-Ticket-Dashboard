import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTime, formatRelativeTime } from '../../utils/formatters';
import { ChevronRight } from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
}

export const TicketTable: React.FC<TicketTableProps> = ({ tickets }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6 w-16">
                ID
              </th>
              <th scope="col" className="px-3 py-3.5 min-w-[280px]">
                Ticket Title
              </th>
              <th scope="col" className="px-3 py-3.5 min-w-[180px]">
                Customer
              </th>
              <th scope="col" className="px-3 py-3.5 w-32">
                Priority
              </th>
              <th scope="col" className="px-3 py-3.5 w-36">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 w-32">
                Created
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 w-16">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                onClick={() => {
                  window.location.href = `/tickets/${ticket.id}`;
                }}
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6 text-xs font-mono font-semibold text-slate-500">
                  #{ticket.id}
                </td>
                <td className="px-3 py-4">
                  <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors text-sm line-clamp-1">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="focus:outline-none focus:underline"
                    >
                      {ticket.title}
                    </Link>
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {ticket.description}
                  </div>
                </td>
                <td className="px-3 py-4 text-xs text-slate-600 truncate max-w-[200px]">
                  {ticket.customerEmail}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>
                <td
                  className="px-3 py-4 whitespace-nowrap text-xs text-slate-500"
                  title={formatDateTime(ticket.createdAt)}
                >
                  {formatRelativeTime(ticket.createdAt)}
                </td>
                <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right text-sm">
                  <Link
                    to={`/tickets/${ticket.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-400 group-hover:text-indigo-600 inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label={`View details for ticket #${ticket.id}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
