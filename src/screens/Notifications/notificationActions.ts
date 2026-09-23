import type {
  TNotificationAction,
  TNotificationTone,
} from '@type/notifications';

import { Colors } from '@constants';

/**
 * Cách dựng thẻ theo việc mà thông báo đòi người dùng làm.
 *
 * `isBlocking` là thứ quyết định hình dáng thẻ: thông báo chặn người dùng thì
 * được viền màu và nút hành động nằm ngay trong thẻ; còn lại nằm phẳng như
 * nhau. Viền đó không phải trang trí — nó nói "cái này đang chờ bạn".
 */
export const NOTIFICATION_ACTION_VIEWS: Record<
  TNotificationAction,
  {
    /** Nhãn nhỏ phía trên tiêu đề; `undefined` là không có nhãn. */
    readonly badgeKey?: string;
    /** Nút chính hiện trong thẻ; `undefined` là cả thẻ bấm để mở. */
    readonly primaryKey?: string;
    /** Viền nổi + nút nằm trong thẻ. */
    readonly isBlocking: boolean;
    /** Nút phụ bên cạnh nút chính. */
    readonly secondaryKey?: string;
  }
> = {
  acknowledge: {
    badgeKey: 'notifications.badge_acknowledge',
    isBlocking: true,
    primaryKey: 'notifications.action_acknowledge',
    secondaryKey: 'notifications.action_detail',
  },
  open: {
    isBlocking: false,
  },
  participate: {
    isBlocking: false,
    primaryKey: 'notifications.action_participate',
  },
};

/** Nền và màu mực của ô icon đứng đầu thẻ. */
export const NOTIFICATION_TONES: Record<
  TNotificationTone,
  { readonly ink: string; readonly tint: string }
> = {
  blue: { ink: Colors.blue02, tint: Colors.blue06 },
  green: { ink: Colors.green12, tint: Colors.green13 },
  neutral: { ink: Colors.gray18, tint: Colors.gray19 },
  purple: { ink: Colors.purple03, tint: Colors.purple04 },
  red: { ink: Colors.red03, tint: Colors.red02 },
};
