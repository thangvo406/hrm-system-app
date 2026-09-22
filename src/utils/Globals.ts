import type { RefObject } from 'react';

export default class Globals {
  static currentTime = '';
  // static currentTime = '2025-06-06T03:18:23.200Z';
  /**
   * Mốc `Date.now()` của thiết bị tại thời điểm `currentTime` được đồng bộ.
   *
   * `useTime` chỉ hỏi giờ máy chủ mỗi 60 giây, nên đọc thẳng `currentTime` thì
   * đồng hồ đứng yên giữa hai lần hỏi. Có mốc này thì cộng được quãng đã trôi.
   * `0` nghĩa là chưa đồng bộ lần nào.
   */
  static currentTimeSyncedAt = 0;
  static hasUpdateDeviceId = false;
  static isAuthenticated = false;
  static isOneSignalInitialized = false;
  static isScrollingRef: RefObject<boolean> | undefined;
  static showingForceUpdate = false;
}
