import type { IconName } from '@assets/icons';
import { Colors } from '@constants';

export type OrderStatus = 'failed' | 'pending' | 'success';

export const SHARED = {
  divider: '#E5E7EB',
  textDark: '#1A1A1A',
  textGray: '#717171',
} as const;

export type Theme = {
  readonly accent: string;
  readonly confetti: readonly [string, string, string];
  readonly heroCircleBg: string;
  readonly heroIcon: IconName;
  readonly i18nBase: string;
  readonly iconBg: string;
  readonly notifyIcon: IconName;
  readonly screenBg: string;
  readonly titleColor: string;
};

export const THEMES: Record<OrderStatus, Theme> = {
  failed: {
    accent: Colors.red03,
    // Confetti reads as celebration, so the failed theme keeps it muted/neutral
    // instead of scattering festive dots over an error screen.
    confetti: [Colors.red02, '#F0D2D2', '#E8DCDC'],
    heroCircleBg: 'rgba(217,83,79,0.15)',
    heroIcon: 'x-circle',
    i18nBase: 'order_completed.failed',
    iconBg: Colors.red02,
    notifyIcon: 'ic_alert_triangle',
    screenBg: '#FDF5F5',
    titleColor: '#A8302B',
  },
  pending: {
    accent: Colors.yellow01,
    confetti: [Colors.yellow01, '#4A5568', '#2196F3'],
    heroCircleBg: 'rgba(245,166,35,0.15)',
    heroIcon: 'ic_clock_filled',
    i18nBase: 'order_completed.pending',
    iconBg: '#FDF3DC',
    notifyIcon: 'ic_hourglass',
    screenBg: '#FDF9F0',
    titleColor: '#D68F0B',
  },
  success: {
    accent: '#5BB85C',
    confetti: ['#4CAF50', '#FFC107', '#2196F3'],
    heroCircleBg: 'rgba(91,184,92,0.15)',
    heroIcon: 'ic_check_filled',
    i18nBase: 'order_completed.success',
    iconBg: '#E8F5E8',
    notifyIcon: 'ic_shield_check',
    screenBg: '#F5FBF5',
    titleColor: '#1A6B1A',
  },
};
