import type { IconName } from '@assets/icons';
import type { Paths } from '@navigation/paths';

/** Nhân viên đang đăng nhập, hiển thị ở header màn Trang chủ. */
export type THomeEmployee = {
  readonly code: string;
  readonly department: string;
  readonly fullName: string;
  /** Chữ viết tắt dựng sẵn cho ô avatar (vd. "MT"). */
  readonly initials: string;
  readonly unreadNotifications: number;
};

export type TShiftPunctuality = 'late' | 'not_checked_in' | 'on_time';

/** Ca làm việc của hôm nay kèm dấu chấm công đã ghi nhận. */
export type THomeShift = {
  /** `undefined` khi chưa chấm công vào ca. */
  readonly checkInAt?: string;
  /** `undefined` khi chưa chấm công ra ca. */
  readonly checkOutAt?: string;
  readonly endAt: string;
  readonly name: string;
  readonly punctuality: TShiftPunctuality;
  readonly startAt: string;
};

/** Màu nền/màu icon của một ô tác vụ nhanh. */
export type TQuickActionTone = 'blue' | 'green' | 'orange' | 'purple';

export type TQuickAction = {
  readonly icon: IconName;
  readonly labelKey: string;
  readonly path: Paths;
  readonly tone: TQuickActionTone;
};

/** Số ngày phép và số đơn đang chờ duyệt. */
export type THomeBalance = {
  readonly pendingRequests: number;
  readonly remainingLeaveDays: number;
  readonly totalLeaveDays: number;
};

export type THomeNotificationTone = 'success' | 'urgent';

export type THomeNotification = {
  readonly icon: IconName;
  readonly id: string;
  /** Hiện nhãn "Cần xác nhận" cạnh tiêu đề. */
  readonly needsAction: boolean;
  readonly source: string;
  readonly timeAgo: string;
  readonly title: string;
  readonly tone: THomeNotificationTone;
};
