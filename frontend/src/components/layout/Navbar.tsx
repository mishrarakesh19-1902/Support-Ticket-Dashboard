import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LifeBuoy, Plus, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onCreateClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCreateClick }) => {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-bold text-slate-900 text-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <span className="hidden sm:inline">Support Desk</span>
            </Link>

            <nav className="flex items-center gap-1">
              <Link
                to="/"
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Tickets</span>
              </Link>
            </nav>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            {onCreateClick ? (
              <button
                type="button"
                onClick={onCreateClick}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Ticket</span>
              </button>
            ) : (
              <Link
                to="/tickets/new"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Ticket</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
