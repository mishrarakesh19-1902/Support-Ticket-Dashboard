import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { StandardErrorResponse } from '../types/ticket.types.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Array<{ field?: string; message: string }>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    details?: Array<{ field?: string; message: string }>
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', id?: string | number) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Array<{ field?: string; message: string }>) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: Array<{ field?: string; message: string }>) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response<StandardErrorResponse>,
  _next: NextFunction
): void => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details = err.errors.map((issue) => ({
      field: issue.path.join('.') || undefined,
      message: issue.message
    }));

    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details
      }
    });
    return;
  }

  // Handle known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && err.details.length > 0 ? { details: err.details } : {})
      }
    });
    return;
  }

  // Handle JSON parse errors from express.json()
  if ('type' in err && (err as any).type === 'entity.parse.failed') {
    res.status(400).json({
      error: {
        code: 'MALFORMED_JSON',
        message: 'Invalid JSON payload received'
      }
    });
    return;
  }

  // Fallback for unexpected internal errors (never leak stack trace)
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal server error occurred'
    }
  });
};
