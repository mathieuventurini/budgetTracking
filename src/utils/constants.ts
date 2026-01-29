export const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
} as const;

export const THRESHOLDS = {
  GREEN: 20, // > 20% des revenus
  ORANGE: 5, // entre 5% et 20% des revenus
  // < 5% = rouge
} as const;

export const STORAGE_KEY_PREFIX = 'budget-app-data';

export const STATUS_LABELS: Record<string, string> = {
  'en-cours': 'En cours',
  'termine': 'Terminé',
  'en-pause': 'En pause',
};

export const STATUS_COLORS: Record<string, string> = {
  'en-cours': 'text-primary bg-primary/10',
  'termine': 'text-success bg-success/10',
  'en-pause': 'text-warning bg-warning/10',
};

export const MONTHS_TO_KEEP = 6;

// Emails autorisés pour la création de compte
export const ALLOWED_EMAILS = [
  'mathieu.venturini@gmail.com',
  'assiap1@outlook.fr',
] as const;
