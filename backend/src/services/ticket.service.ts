import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { Ticket, TicketStats, PaginatedResponse } from '../types/ticket.types.js';
import { CreateTicketInput, UpdateTicketInput, TicketQueryInput } from '../validators/ticket.schema.js';

export class TicketService {
  /**
   * Calculates overall dataset stats (total, open, inProgress, resolved).
   * Ignores any active filters.
   */
  async getStats(): Promise<TicketStats> {
    const [total, open, inProgress, resolved] = await prisma.$transaction([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: 'OPEN' } }),
      prisma.ticket.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.ticket.count({ where: { status: 'RESOLVED' } }),
    ]);

    return {
      total,
      open,
      inProgress,
      resolved,
    };
  }

  /**
   * Retrieves paginated tickets with database-level filtering and sorting.
   */
  async getTickets(query: TicketQueryInput): Promise<PaginatedResponse<Ticket>> {
    const { search, status, priority, sort = 'newest', page = 1 } = query;
    const limit = 10; // Fixed at 10 items per page per requirement

    // Build the database WHERE clause with combined filters (AND)
    const andConditions: Prisma.TicketWhereInput[] = [];

    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      andConditions.push({
        OR: [
          { title: { contains: searchTerm } },
          { customerEmail: { contains: searchTerm } },
        ],
      });
    }

    if (status) {
      andConditions.push({ status });
    }

    if (priority) {
      andConditions.push({ priority });
    }

    const where: Prisma.TicketWhereInput = andConditions.length > 0
      ? { AND: andConditions }
      : {};

    const orderBy: Prisma.TicketOrderByWithRelationInput = {
      createdAt: sort === 'oldest' ? 'asc' : 'desc',
    };

    const skip = (page - 1) * limit;

    // Execute count and paginated query in a transaction for consistency
    const [total, tickets] = await prisma.$transaction([
      prisma.ticket.count({ where }),
      prisma.ticket.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: tickets as Ticket[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Fetches a single ticket by its primary key ID.
   */
  async getTicketById(id: number): Promise<Ticket | null> {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });
    return (ticket as Ticket) || null;
  }

  /**
   * Creates a new ticket.
   */
  async createTicket(data: CreateTicketInput): Promise<Ticket> {
    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        customerEmail: data.customerEmail,
        priority: data.priority ?? 'MEDIUM',
        status: data.status ?? 'OPEN',
      },
    });
    return ticket as Ticket;
  }

  /**
   * Updates status and/or priority of an existing ticket.
   */
  async updateTicket(id: number, data: UpdateTicketInput): Promise<Ticket> {
    const updateData: Prisma.TicketUpdateInput = {};

    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.priority !== undefined) {
      updateData.priority = data.priority;
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: updateData,
    });

    return updatedTicket as Ticket;
  }
}

export const ticketService = new TicketService();
