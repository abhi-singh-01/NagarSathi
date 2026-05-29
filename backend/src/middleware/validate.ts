import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

type Source = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, source: Source = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ');
      return next(ApiError.badRequest(message, 'VALIDATION_ERROR'));
    }
    (req as Request & { validated: unknown }).validated = result.data;
    if (source === 'body') req.body = result.data;
    if (source === 'query') req.query = result.data as typeof req.query;
    next();
  };
}
