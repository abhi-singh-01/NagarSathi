import { Response } from 'express';
import { AuthRequest, signToken } from '../middleware/auth';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { toUserResponse } from '../utils/transform';

export async function signup(req: AuthRequest, res: Response) {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone: phone && String(phone).length > 0 ? phone : undefined,
  });

  const accessToken = signToken(user._id.toString());

  res.status(201).json({
    user: toUserResponse(user),
    tokens: { accessToken },
  });
}

export async function login(req: AuthRequest, res: Response) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const accessToken = signToken(user._id.toString());

  res.json({
    user: toUserResponse(user),
    tokens: { accessToken },
  });
}

export async function me(req: AuthRequest, res: Response) {
  if (!req.user) throw ApiError.unauthorized();
  res.json(toUserResponse(req.user));
}

export async function logout(_req: AuthRequest, res: Response) {
  res.json({ message: 'Logged out successfully' });
}
