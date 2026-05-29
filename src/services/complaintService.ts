import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/src/api/client';
import { API_ENDPOINTS } from '@/src/api/endpoints';
import {
  Complaint,
  ComplaintStatus,
  CreateComplaintPayload,
  StatusHistoryEntry,
} from '@/src/types';

const COMPLAINTS_KEY = '@nagarsathi_complaints';
const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

const getStoredComplaints = async (): Promise<Complaint[]> => {
  const raw = await AsyncStorage.getItem(COMPLAINTS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveComplaints = async (complaints: Complaint[]) =>
  AsyncStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));

const seedDemoComplaints = async (userId: string): Promise<Complaint[]> => {
  const existing = await getStoredComplaints();
  if (existing.length > 0) return existing;

  const now = new Date();
  const demo: Complaint[] = [
    {
      id: 'demo_1',
      userId,
      category: 'pothole',
      description: 'Large pothole near bus stop causing traffic hazard.',
      photoUri: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
      location: { latitude: 28.6139, longitude: 77.209, accuracy: 5 },
      address: 'Connaught Place, New Delhi',
      status: 'in_progress',
      statusHistory: [
        { status: 'submitted', timestamp: new Date(now.getTime() - 86400000 * 3).toISOString() },
        { status: 'in_review', timestamp: new Date(now.getTime() - 86400000 * 2).toISOString() },
        { status: 'in_progress', note: 'Municipal team assigned', timestamp: new Date(now.getTime() - 86400000).toISOString() },
      ],
      createdAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000).toISOString(),
    },
    {
      id: 'demo_2',
      userId,
      category: 'garbage',
      description: 'Uncollected garbage pile blocking footpath for a week.',
      photoUri: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b782?w=400',
      location: { latitude: 19.076, longitude: 72.8777, accuracy: 8 },
      address: 'Bandra West, Mumbai',
      status: 'resolved',
      statusHistory: [
        { status: 'submitted', timestamp: new Date(now.getTime() - 86400000 * 7).toISOString() },
        { status: 'in_review', timestamp: new Date(now.getTime() - 86400000 * 5).toISOString() },
        { status: 'in_progress', timestamp: new Date(now.getTime() - 86400000 * 3).toISOString() },
        { status: 'resolved', note: 'Area cleaned and sanitized', timestamp: new Date(now.getTime() - 86400000).toISOString() },
      ],
      createdAt: new Date(now.getTime() - 86400000 * 7).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000).toISOString(),
    },
  ];
  await saveComplaints(demo);
  return demo;
};

const mockCreate = async (userId: string, payload: CreateComplaintPayload): Promise<Complaint> => {
  await delay(800);
  const complaints = await getStoredComplaints();
  const entry: StatusHistoryEntry = {
    status: 'submitted',
    note: 'Complaint received by NagarSathi',
    timestamp: new Date().toISOString(),
  };
  const complaint: Complaint = {
    id: `cmp_${Date.now()}`,
    userId,
    ...payload,
    status: 'submitted',
    statusHistory: [entry],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  complaints.unshift(complaint);
  await saveComplaints(complaints);

  // Simulate status progression for demo
  setTimeout(async () => {
    const all = await getStoredComplaints();
    const idx = all.findIndex((c) => c.id === complaint.id);
    if (idx >= 0 && all[idx].status === 'submitted') {
      all[idx].status = 'in_review';
      all[idx].statusHistory.push({
        status: 'in_review',
        note: 'Forwarded to municipal ward office',
        timestamp: new Date().toISOString(),
      });
      all[idx].updatedAt = new Date().toISOString();
      await saveComplaints(all);
    }
  }, 10000);

  return complaint;
};

export const complaintService = {
  async fetchAll(userId?: string): Promise<Complaint[]> {
    if (USE_MOCK) {
      await delay(300);
      let complaints = await getStoredComplaints();
      if (userId && complaints.length === 0) {
        complaints = await seedDemoComplaints(userId);
      }
      return complaints;
    }
    const { data } = await apiClient.get<Complaint[]>(API_ENDPOINTS.complaints.list);
    return data;
  },

  async fetchMine(userId: string): Promise<Complaint[]> {
    if (USE_MOCK) {
      const all = await this.fetchAll(userId);
      return all.filter((c) => c.userId === userId);
    }
    const { data } = await apiClient.get<Complaint[]>(API_ENDPOINTS.complaints.mine);
    return data;
  },

  async fetchNearby(
    latitude: number,
    longitude: number,
    radiusMeters = 5000
  ): Promise<Complaint[]> {
    if (USE_MOCK) {
      const all = await getStoredComplaints();
      return all.filter((c) => {
        const dLat = (c.location.latitude - latitude) * 111320;
        const dLng =
          (c.location.longitude - longitude) *
          111320 *
          Math.cos((latitude * Math.PI) / 180);
        return Math.sqrt(dLat * dLat + dLng * dLng) <= radiusMeters;
      });
    }
    const { data } = await apiClient.get<{ data: Complaint[] }>(
      API_ENDPOINTS.complaints.nearby,
      { params: { latitude, longitude, radius: radiusMeters } }
    );
    return data.data;
  },

  async fetchById(id: string): Promise<Complaint | null> {
    if (USE_MOCK) {
      const all = await getStoredComplaints();
      return all.find((c) => c.id === id) ?? null;
    }
    const { data } = await apiClient.get<Complaint>(API_ENDPOINTS.complaints.byId(id));
    return data;
  },

  async create(userId: string, payload: CreateComplaintPayload): Promise<Complaint> {
    if (USE_MOCK) {
      return mockCreate(userId, payload);
    }

    const formData = new FormData();
    formData.append('category', payload.category);
    formData.append('description', payload.description);
    formData.append('latitude', String(payload.location.latitude));
    formData.append('longitude', String(payload.location.longitude));
    if (payload.address) formData.append('address', payload.address);

    const filename = payload.photoUri.split('/').pop() ?? 'photo.jpg';
    formData.append('photo', {
      uri: payload.photoUri,
      name: filename,
      type: 'image/jpeg',
    } as unknown as Blob);

    const { data } = await apiClient.post<Complaint>(API_ENDPOINTS.complaints.create, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getStatusProgress(status: ComplaintStatus): number {
    const order: ComplaintStatus[] = ['submitted', 'in_review', 'in_progress', 'resolved'];
    const idx = order.indexOf(status);
    if (status === 'rejected') return 0;
    return idx < 0 ? 0 : ((idx + 1) / order.length) * 100;
  },
};
