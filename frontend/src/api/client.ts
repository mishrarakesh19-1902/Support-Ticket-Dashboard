import {
  Ticket,
  TicketStats,
  PaginatedResponse,
  TicketQueryParams,
  CreateTicketDTO,
  UpdateTicketDTO,
  ApiErrorResponse,
  ErrorDetail,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details: ErrorDetail[];

  constructor(message: string, statusCode: number, code: string = 'API_ERROR', details: ErrorDetail[] = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Unified request helper that handles standard JSON formatting, status codes,
 * and standard error response deserialization.
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    throw new ApiError(
      'Unable to connect to the support server. Please check your connection.',
      0,
      'NETWORK_ERROR'
    );
  }

  // Parse JSON response
  let data: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorBody = data as ApiErrorResponse | undefined;
    const message = errorBody?.error?.message || `Request failed with status ${response.status}`;
    const code = errorBody?.error?.code || 'HTTP_ERROR';
    const details = errorBody?.error?.details || [];

    throw new ApiError(message, response.status, code, details);
  }

  return data as T;
}

export const ticketApi = {
  /**
   * Fetches paginated tickets with optional filtering and sorting.
   */
  async getTickets(params: TicketQueryParams = {}): Promise<PaginatedResponse<Ticket>> {
    const searchParams = new URLSearchParams();

    if (params.search && params.search.trim()) {
      searchParams.set('search', params.search.trim());
    }
    if (params.status) {
      searchParams.set('status', params.status);
    }
    if (params.priority) {
      searchParams.set('priority', params.priority);
    }
    if (params.sort) {
      searchParams.set('sort', params.sort);
    }
    if (params.page && params.page > 1) {
      searchParams.set('page', params.page.toString());
    }

    const queryStr = searchParams.toString();
    const endpoint = queryStr ? `/tickets?${queryStr}` : '/tickets';

    return apiRequest<PaginatedResponse<Ticket>>(endpoint);
  },

  /**
   * Fetches overall ticket counts across all statuses.
   */
  async getStats(): Promise<TicketStats> {
    return apiRequest<TicketStats>('/tickets/stats');
  },

  /**
   * Fetches full ticket details by ID.
   */
  async getTicketById(id: number): Promise<Ticket> {
    return apiRequest<Ticket>(`/tickets/${id}`);
  },

  /**
   * Creates a new ticket.
   */
  async createTicket(dto: CreateTicketDTO): Promise<Ticket> {
    return apiRequest<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Updates status and/or priority of an existing ticket.
   */
  async updateTicket(id: number, dto: UpdateTicketDTO): Promise<Ticket> {
    return apiRequest<Ticket>(`/tickets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },
};
