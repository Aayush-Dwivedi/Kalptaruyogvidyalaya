import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodEffects, ZodError } from 'zod';

type SchemaTarget = AnyZodObject | ZodEffects<AnyZodObject> | ZodEffects<any>;

export interface RequestValidationSchema {
  body?: SchemaTarget;
  params?: SchemaTarget;
  query?: SchemaTarget;
}

/**
 * Express middleware to validate incoming request data (body, params, query) against Zod schemas.
 * Throws ZodError directly so the centralized errorHandler formats and responds with 400.
 */
export const validate = (schema: RequestValidationSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schema.params) {
        req.params = (await schema.params.parseAsync(req.params)) as any;
      }
      if (schema.query) {
        req.query = (await schema.query.parseAsync(req.query)) as any;
      }
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(error);
      }
    }
  };
};
