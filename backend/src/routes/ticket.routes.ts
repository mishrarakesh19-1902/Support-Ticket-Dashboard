import { Router } from 'express';
import { ticketController } from '../controllers/ticket.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

// Stats endpoint MUST be defined before /:id route so it is not caught by the parameter
router.get('/stats', asyncHandler(ticketController.getStats));

// List and Create
router.get('/', asyncHandler(ticketController.getTickets));
router.post('/', asyncHandler(ticketController.createTicket));

// Detail and Update
router.get('/:id', asyncHandler(ticketController.getTicketById));
router.patch('/:id', asyncHandler(ticketController.updateTicket));

export default router;
