import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

/**
 * 404 handler for routes that do not exist
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}
