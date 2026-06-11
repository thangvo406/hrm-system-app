// Visual tokens for the dialog/toast system.
// Centralized here so overlays stay consistent and easy to theme later.

export const DIALOG_COLORS = {
  backdrop: 'rgba(0,0,0,0.5)',
  card: '#FFFFFF',
  toast: '#1A1A1A',
  toastDanger: '#D9534F',
  toastSuccess: '#5BB85C',
  toastText: '#FFFFFF',
} as const;

export const DIALOG_SIZES = {
  cardMaxWidth: 340,
  cardRadius: 18,
  cardVerticalPadding: 24,
  toastMaxWidth: 360,
  toastRadius: 14,
  toastVerticalPadding: 14,
} as const;

export const DIALOG_TIMING = {
  animationDuration: 220,
  defaultToastDuration: 2500,
} as const;

export const DIALOG_Z_INDEX = {
  base: 1000,
  step: 10,
} as const;
