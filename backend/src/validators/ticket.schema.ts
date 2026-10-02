import { z } from 'zod';

export const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH'], {
  errorMap: () => ({ message: "Priority must be one of 'LOW', 'MEDIUM', or 'HIGH'" })
});

export const StatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED'], {
  errorMap: () => ({ message: "Status must be one of 'OPEN', 'IN_PROGRESS', or 'RESOLVED'" })
});

export const createTicketSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title must be 120 characters or fewer'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, 'Description is required'),
  customerEmail: z
    .string({ required_error: 'Customer email is required' })
    .trim()
    .email('Customer email must be a valid email address'),
  priority: PriorityEnum.optional().default('MEDIUM'),
  status: StatusEnum.optional().default('OPEN')
}).strict({
  message: 'Unexpected fields in ticket creation payload'
});

export const updateTicketSchema = z.object({
  priority: PriorityEnum.optional(),
  status: StatusEnum.optional()
})
.strict({
  message: 'Only status and priority can be updated'
})
.refine((data) => data.priority !== undefined || data.status !== undefined, {
  message: 'At least one of status or priority must be provided for update'
});

export const ticketQuerySchema = z.object({
  search: z.string().optional(),
  status: StatusEnum.optional(),
  priority: PriorityEnum.optional(),
  sort: z.enum(['newest', 'oldest'], {
    errorMap: () => ({ message: "Sort must be 'newest' or 'oldest'" })
  }).optional().default('newest'),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1, 'Page must be a positive integer greater than or equal to 1')),
  limit: z
    .string()
    .optional()
    .transform(() => 10) // Fixed at 10 items per page as specified in requirements
});

export const ticketIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Ticket ID must be a valid positive integer')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive('Ticket ID must be greater than 0'))
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type TicketQueryInput = z.infer<typeof ticketQuerySchema>;
