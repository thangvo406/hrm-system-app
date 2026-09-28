import type { AppCallback, ListApiResponse } from '@type/common';
import type { IconName } from '@assets/icons';

/**
 * Việc thông báo này đòi người dùng làm gì. Đây là trục tổ chức chính của màn
 * Thông báo: hành động quyết định thẻ được dựng ra sao.
 */
export type TNotificationAction =
  /** Phải bấm xác nhận đã đọc thì mới coi như xong. */
  | 'acknowledge'
  /** Chỉ đọc; bấm vào thẻ là mở nội dung. */
  | 'open'
  /** Có việc làm kèm theo, ví dụ khảo sát. */
  | 'participate';

export type TNotificationTone = 'blue' | 'green' | 'neutral' | 'purple' | 'red';

export type TNotificationFilter = 'all' | 'needs_action' | 'unread';

export type TNotificationItem = {
  readonly action: TNotificationAction;
  readonly at: string;
  readonly body: string;
  readonly icon: IconName;
  readonly id: string;
  readonly isRead: boolean;
  readonly source?: string;
  readonly title: string;
  readonly tone: TNotificationTone;
};

export interface IRequestGetNotifications
  extends AppCallback<ListApiResponse<TNotificationItem[]>> {
  filter?: string;
  page: number;
  size: number;
}

export type TNotificationCounts = {
  readonly all: number;
  readonly needs_action: number;
  readonly unread: number;
};

export type IRequestGetNotificationCounts = AppCallback<TNotificationCounts>;
