import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';

/**
 * Design tokens shared by every row on the payment-methods screen so the two
 * section types (cards / bank accounts) read as one system.
 */
export const PAGE_SURFACE = '#F6F7F9';
export const ROW_SURFACE = '#FFFFFF';
export const ROW_RADIUS = ScaleSize(18);
export const ROW_PADDING = ScaleSize(14);
export const ROW_GAP = ScaleSize(12);

export const TITLE_INK = '#1A1A1A';
export const MUTED_INK = '#8A8F94';
export const ACCENT_INK = Colors.green01;
export const ACCENT_SURFACE = '#EEF6F0';
export const DANGER_INK = '#D9534F';
export const DANGER_SURFACE = '#FDECEC';
export const WARNING_INK = '#D98A2B';
export const WARNING_SURFACE = '#FBEAD7';
export const HAIRLINE = '#EDEFF2';

export const PILL_RADIUS = ScaleSize(10);
export const THUMBNAIL_RADIUS = ScaleSize(12);

/** Card art, cycled per row — deep navy, near-black, deep coop green. */
export const CARD_GRADIENTS: readonly (readonly string[])[] = [
  ['#2B2F6B', '#171A3C'],
  ['#2E2E2E', '#0D0D0D'],
  ['#1A6633', '#0C3A1C'],
];
