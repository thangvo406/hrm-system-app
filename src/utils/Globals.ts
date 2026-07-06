import type { FloatingCartButtonRef } from '@navigation/FloatingCartButton';
import type { RefObject } from 'react';

export default class Globals {
  static currentTime = '';
  // static currentTime = '2025-06-06T03:18:23.200Z';
  static hasUpdateDeviceId = false;
  static isAuthenticated = false;
  static cartBtnRef: FloatingCartButtonRef | null | undefined;
  static isScrollingRef: RefObject<boolean> | undefined;
}
