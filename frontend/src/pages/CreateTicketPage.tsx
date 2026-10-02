import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ticketApi, ApiError } from '../api/client';
import { Priority } from '../types';
import { ArrowLeft, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface FormErrors {
  title?: string;
  description?: string;
  customerEmail?: string;
  priority?: string;
  general?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Client-side validation function mirroring backend Zod schema
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Title is required';
    } else if (trimmedTitle.length > 120) {
      newErrors.title = 'Title must be 120 characters or fewer';
    }

    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      newErrors.description = 'Description is required';
    }

    const trimmedEmail = customerEmail.trim();
    if (!trimmedEmail) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.customerEmail = 'Customer email must be a valid email address';
    }

    if (!['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
      newErrors.priority = 'Priority must be LOW, MEDIUM, or HIGH';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, description: true, customerEmail: true, priority: true });

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const createdTicket = await ticketApi.createTicket({
        title: title.trim(),
        description: description.trim(),
        customerEmail: customerEmail.trim(),
        priority,
      });

      setSuccessMessage(`Ticket #${createdTicket.id} created successfully! Redirecting...`);
      setTimeout(() => {
        navigate(`/tickets/${createdTicket.id}`);
      }, 700);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.details && err.details.length > 0) {
          const serverErrors: FormErrors = {};
          err.details.forEach((item) => {
            if (item.field === 'title') serverErrors.title = item.message;
            else if (item.field === 'description') serverErrors.description = item.message;
            else if (item.field === 'customerEmail') serverErrors.customerEmail = item.message;
            else if (item.field === 'priority') serverErrors.priority = item.message;
            else serverErrors.general = item.message;
          });
          setErrors(serverErrors);
        } else {
          setErrors({ general: err.message });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred while creating the ticket.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleCharsLeft = 120 - title.length;

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all tickets</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Support Ticket</h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit a new customer support request to track and resolve.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-sm font-medium animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* General Error Alert */}
        {errors.general && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800 text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Failed to create ticket</p>
              <p className="text-xs text-rose-700 mt-0.5">{errors.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Title Field with Character Counter */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="ticket-title" className="block text-sm font-semibold text-slate-900">
                Ticket Title <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-xs font-mono font-medium ${
                  titleCharsLeft < 0
                    ? 'text-rose-600 font-bold'
                    : titleCharsLeft <= 15
                    ? 'text-amber-600'
                    : 'text-slate-400'
                }`}
              >
                {title.length}/120
              </span>
            </div>
            <input
              id="ticket-title"
              type="text"
              value={title}
              maxLength={130}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleBlur('title')}
              placeholder="e.g., Cannot access billing invoice PDF"
              className={`w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                touched.title && errors.title
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-indigo-500 focus:border-transparent'
              }`}
              aria-invalid={!!(touched.title && errors.title)}
              aria-describedby={touched.title && errors.title ? 'title-error' : undefined}
            />
            {touched.title && errors.title && (
              <p id="title-error" className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Customer Email Field */}
          <div>
            <label htmlFor="customer-email" className="block text-sm font-semibold text-slate-900 mb-1.5">
              Customer Email <span className="text-rose-500">*</span>
            </label>
            <input
              id="customer-email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              onBlur={() => handleBlur('customerEmail')}
              placeholder="customer@company.com"
              className={`w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                touched.customerEmail && errors.customerEmail
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-indigo-500 focus:border-transparent'
              }`}
              aria-invalid={!!(touched.customerEmail && errors.customerEmail)}
              aria-describedby={touched.customerEmail && errors.customerEmail ? 'email-error' : undefined}
            />
            {touched.customerEmail && errors.customerEmail && (
              <p id="email-error" className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.customerEmail}
              </p>
            )}
          </div>

          {/* Priority Select Field */}
          <div>
            <label htmlFor="ticket-priority" className="block text-sm font-semibold text-slate-900 mb-1.5">
              Priority
            </label>
            <select
              id="ticket-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="LOW">Low - General inquiry, minor UI annoyance</option>
              <option value="MEDIUM">Medium - Normal workflow issue, default</option>
              <option value="HIGH">High - Service outage, blocker, payment failure</option>
            </select>
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="ticket-description" className="block text-sm font-semibold text-slate-900 mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="ticket-description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleBlur('description')}
              placeholder="Provide detailed information regarding the issue, steps to reproduce, error messages, and customer impact..."
              className={`w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                touched.description && errors.description
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-indigo-500 focus:border-transparent'
              }`}
              aria-invalid={!!(touched.description && errors.description)}
              aria-describedby={touched.description && errors.description ? 'desc-error' : undefined}
            />
            {touched.description && errors.description && (
              <p id="desc-error" className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Ticket...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
