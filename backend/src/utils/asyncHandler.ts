import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Higher-order function that catches async errors and forwards them to next()
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
