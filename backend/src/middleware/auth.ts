import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser } from '../models/User';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  sub: string;
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or invalid authorization header');
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    const user = await User.findById(decoded.sub);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    if (err instanceof jwt.JsonWebTokenError) {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }
    next(err);
  }
};

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}
