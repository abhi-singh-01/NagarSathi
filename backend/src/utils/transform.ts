import { Request } from 'express';
import { IComplaint } from '../models/Complaint';
import { IUser } from '../models/User';
import { env } from '../config/env';

export interface ComplaintResponse {
  id: string;
  userId: string;
  category: string;
  description: string;
  photoUri: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
  };
  address?: string;
  status: string;
  statusHistory: Array<{
    status: string;
    note?: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

function resolveBaseUrl(req?: Request): string {
  if (req) {
    return `${req.protocol}://${req.get('host')}`;
  }
  return env.baseUrl.replace(/\/$/, '');
}

export function toPhotoUri(filename: string, req?: Request): string {
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  return `${resolveBaseUrl(req)}/uploads/${filename}`;
}

export function toUserResponse(user: IUser): UserResponse {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toComplaintResponse(
  complaint: IComplaint,
  req?: Request
): ComplaintResponse {
  return {
    id: complaint._id.toString(),
    userId: complaint.userId.toString(),
    category: complaint.category,
    description: complaint.description,
    photoUri: toPhotoUri(complaint.photo, req),
    location: {
      latitude: complaint.latitude,
      longitude: complaint.longitude,
      accuracy: complaint.accuracy ?? null,
    },
    address: complaint.address,
    status: complaint.status,
    statusHistory: complaint.statusHistory.map((h) => ({
      status: h.status,
      note: h.note,
      timestamp: h.timestamp.toISOString(),
    })),
    createdAt: complaint.createdAt.toISOString(),
    updatedAt: complaint.updatedAt.toISOString(),
  };
}
