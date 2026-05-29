import { ComplaintStatus } from '@/src/types';
import { STATUS_LABELS } from '@/src/constants/theme';

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCoords = (lat: number, lng: number): string =>
  `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;

export const getStatusLabel = (status: ComplaintStatus): string =>
  STATUS_LABELS[status] ?? status;

export const truncate = (text: string, max = 80): string =>
  text.length <= max ? text : `${text.slice(0, max)}…`;
