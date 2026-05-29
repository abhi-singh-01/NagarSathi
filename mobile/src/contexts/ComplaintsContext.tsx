import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { complaintService } from '@/src/services/complaintService';
import { Complaint, CreateComplaintPayload } from '@/src/types';

interface ComplaintsContextValue {
  complaints: Complaint[];
  myComplaints: Complaint[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  submitComplaint: (payload: CreateComplaintPayload) => Promise<Complaint>;
  getComplaint: (id: string) => Promise<Complaint | null>;
}

const ComplaintsContext = createContext<ComplaintsContextValue | null>(null);

export function ComplaintsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await complaintService.fetchAll(user.id);
      setComplaints(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const submitComplaint = useCallback(
    async (payload: CreateComplaintPayload) => {
      if (!user) throw new Error('You must be logged in to submit a complaint.');
      setIsSubmitting(true);
      setError(null);
      try {
        const created = await complaintService.create(user.id, payload);
        setComplaints((prev) => [created, ...prev]);
        return created;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to submit complaint';
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [user]
  );

  const getComplaint = useCallback(async (id: string) => {
    const local = complaints.find((c) => c.id === id);
    if (local) return local;
    return complaintService.fetchById(id);
  }, [complaints]);

  const myComplaints = useMemo(
    () => (user ? complaints.filter((c) => c.userId === user.id) : []),
    [complaints, user]
  );

  const value = useMemo(
    () => ({
      complaints,
      myComplaints,
      isLoading,
      isSubmitting,
      error,
      refresh,
      submitComplaint,
      getComplaint,
    }),
    [complaints, myComplaints, isLoading, isSubmitting, error, refresh, submitComplaint, getComplaint]
  );

  return <ComplaintsContext.Provider value={value}>{children}</ComplaintsContext.Provider>;
}

export function useComplaints() {
  const ctx = useContext(ComplaintsContext);
  if (!ctx) throw new Error('useComplaints must be used within ComplaintsProvider');
  return ctx;
}
