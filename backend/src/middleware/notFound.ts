import { Request, Response } from 'express';
import { StandardErrorResponse } from '../types/ticket.types.js';

export const notFoundHandler = (req: Request, res: Response<StandardErrorResponse>): void => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} does not exist`
    }
  });
};
