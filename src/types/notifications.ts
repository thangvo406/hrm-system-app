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

/** Họ màu của ô icon đứng đầu mỗi thẻ. */
export type TNotificationTone = 'blue' | 'green' | 'neutral' | 'purple' | 'red';

/** Nhóm thông báo đang xem trên hàng lọc. */
export type TNotificationFilter = 'all' | 'needs_action' | 'unread';

/** Một thông báo trong danh sách. */
export type TNotificationItem = {
  readonly action: TNotificationAction;
  /** Thời điểm đã định dạng sẵn, ví dụ `2 giờ trước` hay `Hôm qua, 16:40`. */
  readonly at: string;
  readonly body: string;
  readonly icon: IconName;
  readonly id: string;
  readonly isRead: boolean;
  /** Nơi phát thông báo; `undefined` khi là thông báo hệ thống. */
  readonly source?: string;
  readonly title: string;
  readonly tone: TNotificationTone;
};
