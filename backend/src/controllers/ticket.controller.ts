import { Request, Response } from 'express';
import { ticketService } from '../services/ticket.service.js';
import {
  createTicketSchema,
  updateTicketSchema,
  ticketQuerySchema,
  ticketIdParamSchema,
} from '../validators/ticket.schema.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { Ticket, TicketStats, PaginatedResponse } from '../types/ticket.types.js';

export class TicketController {
  /**
   * GET /api/tickets/stats
   * Returns dataset-wide ticket counts.
   */
  getStats = async (_req: Request, res: Response<TicketStats>): Promise<void> => {
    const stats = await ticketService.getStats();
    res.status(200).json(stats);
  };

  /**
   * GET /api/tickets
   * Returns paginated tickets with filtering and sorting.
   */
  getTickets = async (req: Request, res: Response<PaginatedResponse<Ticket>>): Promise<void> => {
    const validatedQuery = ticketQuerySchema.parse(req.query);
    const result = await ticketService.getTickets(validatedQuery);
    res.status(200).json(result);
  };

  /**
   * GET /api/tickets/:id
   * Returns a single ticket by ID.
   */
  getTicketById = async (req: Request, res: Response<Ticket>): Promise<void> => {
    const { id } = ticketIdParamSchema.parse(req.params);
    const ticket = await ticketService.getTicketById(id);

    if (!ticket) {
      throw new NotFoundError('Ticket', id);
    }

    res.status(200).json(ticket);
  };

  /**
   * POST /api/tickets
   * Creates a new support ticket.
   */
  createTicket = async (req: Request, res: Response<Ticket>): Promise<void> => {
    const validatedBody = createTicketSchema.parse(req.body);
    const createdTicket = await ticketService.createTicket(validatedBody);
    res.status(201).json(createdTicket);
  };

  /**
   * PATCH /api/tickets/:id
   * Updates status and/or priority of an existing ticket.
   */
  updateTicket = async (req: Request, res: Response<Ticket>): Promise<void> => {
    const { id } = ticketIdParamSchema.parse(req.params);
    const validatedBody = updateTicketSchema.parse(req.body);

    const existing = await ticketService.getTicketById(id);
    if (!existing) {
      throw new NotFoundError('Ticket', id);
    }

    const updatedTicket = await ticketService.updateTicket(id, validatedBody);
    res.status(200).json(updatedTicket);
  };
}

export const ticketController = new TicketController();
