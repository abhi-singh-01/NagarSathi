import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound('Route not found'));
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.code === 'LIMIT_FILE_SIZE' ? 'Image file is too large' : err.message,
      code: 'UPLOAD_ERROR',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message, code: 'VALIDATION_ERROR' });
  }

  if ((err as { code?: number }).code === 11000) {
    return res.status(409).json({ message: 'Duplicate entry', code: 'DUPLICATE' });
  }

  console.error('[Error]', err);

  res.status(500).json({
    message: env.isProduction ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
  });
}
