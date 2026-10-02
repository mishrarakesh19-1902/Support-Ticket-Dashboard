import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { ErrorDetail } from '../../types';

interface ErrorAlertProps {
  title?: string;
  message: string;
  details?: ErrorDetail[];
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Something went wrong',
  message,
  details,
  onRetry,
}) => {
  return (
    <div
      className="bg-rose-50 border border-rose-200 rounded-xl p-5 my-4 text-rose-900"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-rose-900">{title}</h4>
          <p className="text-sm text-rose-700 mt-1">{message}</p>

          {details && details.length > 0 && (
            <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-rose-600">
              {details.map((item, idx) => (
                <li key={idx}>
                  {item.field ? <span className="font-semibold">{item.field}: </span> : null}
                  {item.message}
                </li>
              ))}
            </ul>
          )}

          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 text-rose-800 text-xs font-semibold hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
