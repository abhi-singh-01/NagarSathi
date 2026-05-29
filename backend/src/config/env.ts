import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  mongodbUri: requireEnv('MONGODB_URI', 'mongodb://127.0.0.1:27017/nagarsathi'),
  jwtSecret: requireEnv('JWT_SECRET', 'dev-only-change-in-production-min-32-chars!!'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB ?? '5', 10),
  isProduction: process.env.NODE_ENV === 'production',
};
