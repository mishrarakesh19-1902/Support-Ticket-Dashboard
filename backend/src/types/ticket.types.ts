export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type SortOrder = 'newest' | 'oldest';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  customerEmail: string;
  priority: Priority;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface StandardErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
}
