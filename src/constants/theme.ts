/** NagarSathi — Indian civic app design tokens */
export const Theme = {
  colors: {
    primary: '#0F766E',
    primaryDark: '#0D5C56',
    primaryLight: '#14B8A6',
    accent: '#FF9933',
    accentDark: '#E67E22',
    saffron: '#FF9933',
    green: '#138808',
    background: '#F4F7F6',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#1A2E2A',
    textSecondary: '#5C6F6A',
    textMuted: '#8A9A95',
    border: '#E2EAE8',
    error: '#DC2626',
    success: '#16A34A',
    warning: '#D97706',
    white: '#FFFFFF',
    overlay: 'rgba(15, 118, 110, 0.08)',
    mapPin: '#0F766E',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 32,
  },
  shadow: {
    card: {
      shadowColor: '#0F766E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    fab: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
  },
} as const;

export const STATUS_COLORS: Record<string, string> = {
  submitted: '#6366F1',
  in_review: '#D97706',
  in_progress: '#0EA5E9',
  resolved: '#16A34A',
  rejected: '#DC2626',
};

export const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  in_review: 'Under Review',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};
