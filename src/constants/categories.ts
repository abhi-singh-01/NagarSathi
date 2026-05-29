import { ComplaintCategory } from '@/src/types';

export interface CategoryConfig {
  id: ComplaintCategory;
  label: string;
  labelHi: string;
  icon: string;
  color: string;
}

export const COMPLAINT_CATEGORIES: CategoryConfig[] = [
  {
    id: 'pothole',
    label: 'Pothole',
    labelHi: 'गड्ढा',
    icon: 'construct',
    color: '#B45309',
  },
  {
    id: 'garbage',
    label: 'Garbage',
    labelHi: 'कचरा',
    icon: 'trash',
    color: '#15803D',
  },
  {
    id: 'broken_streetlight',
    label: 'Broken Streetlight',
    labelHi: 'टूटी स्ट्रीटलाइट',
    icon: 'bulb',
    color: '#CA8A04',
  },
  {
    id: 'water_leakage',
    label: 'Water Leakage',
    labelHi: 'पानी का रिसाव',
    icon: 'water',
    color: '#0369A1',
  },
  {
    id: 'sewage',
    label: 'Sewage',
    labelHi: 'सीवेज',
    icon: 'warning',
    color: '#7C2D12',
  },
];

export const getCategoryConfig = (id: ComplaintCategory) =>
  COMPLAINT_CATEGORIES.find((c) => c.id === id)!;
