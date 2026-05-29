import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import complaintRoutes from './routes/complaintRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(compression());

  const corsOrigins =
    env.corsOrigin === '*'
      ? true
      : env.corsOrigin.split(',').map((o) => o.trim());

  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: env.isProduction ? 200 : 1000,
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: 'Too many requests, please try again later' },
    })
  );

  if (!env.isProduction) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'uploads'), {
      maxAge: env.isProduction ? '7d' : 0,
    })
  );

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'nagarsathi-api',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/auth', authRoutes);
  app.use('/complaints', complaintRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
