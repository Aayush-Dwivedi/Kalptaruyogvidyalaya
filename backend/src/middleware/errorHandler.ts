import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/appError';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { env } from '../config/env';

/**
 * Global centralized error-handling middleware
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Handle custom AppError
  if (err instanceof AppError) {
    ApiResponse.error(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Handle Zod schema validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    ApiResponse.error(res, 'Validation failed', 400, formattedErrors);
    return;
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    ApiResponse.error(res, 'Invalid identifier format', 400);
    return;
  }

  // Handle Mongoose duplicate key error (code 11000)
  if ('code' in err && (err as { code: number }).code === 11000) {
    ApiResponse.error(res, 'Duplicate key error: A resource with that value already exists', 409);
    return;
  }

  // Handle unhandled / unexpected errors
  const isDev = env.NODE_ENV === 'development';
  ApiResponse.error(
    res,
    isDev ? err.message : 'Internal Server Error',
    500,
    isDev ? { stack: err.stack } : undefined
  );
};
