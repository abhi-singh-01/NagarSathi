export type ComplaintCategory =
  | 'pothole'
  | 'garbage'
  | 'broken_streetlight'
  | 'water_leakage'
  | 'sewage';

export type ComplaintStatus = 'submitted' | 'in_review' | 'in_progress' | 'resolved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
}

export interface Complaint {
  id: string;
  userId: string;
  category: ComplaintCategory;
  description: string;
  photoUri: string;
  location: LocationCoords;
  address?: string;
  status: ComplaintStatus;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryEntry {
  status: ComplaintStatus;
  note?: string;
  timestamp: string;
}

export interface CreateComplaintPayload {
  category: ComplaintCategory;
  description: string;
  photoUri: string;
  location: LocationCoords;
  address?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ApiError {
  message: string;
  code?: string;
}
