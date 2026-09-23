import type {
  TNotificationFilter,
  TNotificationItem,
} from '@type/notifications';

import { NOTIFICATION_ACTION_VIEWS } from '@screens/Notifications/notificationActions';
import { useCallback, useMemo, useState } from 'react';

// ─── Mock data ────────────────────────────────────────────────────────────────
// Dữ liệu dựng UI, chưa nối API. Khi có endpoint thật thì thay khối này bằng
// saga callback (xem flow ở .cursorrules §5).

const MOCK_NOTIFICATIONS: readonly TNotificationItem[] = [
  {
    action: 'acknowledge',
    at: '2 giờ trước',
    body: 'Giờ vào ca linh hoạt 08:00–09:00, bắt buộc chấm công GPS/QR tại văn phòng.',
    icon: 'ic_megaphone',
    id: 'notif-policy',
    isRead: false,
    title: 'Quy định chấm công & giờ làm linh hoạt từ 01/10',
    tone: 'red',
  },
  {
    action: 'open',
    at: 'Hôm qua, 16:40',
    body: 'Thực nhận 17.857.000 đ · đã chuyển khoản',
    icon: 'ic_credit_card',
    id: 'notif-payslip',
    isRead: false,
    source: 'Phòng Nhân sự',
    title: 'Phiếu lương kỳ 08/2026 đã phát hành',
    tone: 'blue',
  },
  {
    action: 'open',
    at: 'Hôm qua, 09:12',
    body: 'Trần Quốc Hưng đã duyệt · quỹ phép còn 6,5 ngày',
    icon: 'ic_check_circle',
    id: 'notif-leave',
    isRead: false,
    title: 'Đơn nghỉ phép 24–25/09 đã được duyệt',
    tone: 'green',
  },
  {
    action: 'open',
    at: '3 ngày trước',
    body: 'Hình ảnh và chia sẻ từ đội ngũ tại lễ khai trương ngày 12/09.',
    icon: 'ic_image',
    id: 'notif-news',
    isRead: true,
    source: 'Truyền thông nội bộ',
    title: 'Specom khai trương văn phòng Đà Nẵng',
    tone: 'neutral',
  },
  {
    action: 'participate',
    at: 'Còn 4 ngày · ẩn danh',
    body: 'Còn 4 ngày · ẩn danh',
    icon: 'ic_document',
    id: 'notif-survey',
    isRead: true,
    title: 'Khảo sát hài lòng Q3/2026',
    tone: 'purple',
  },
];

// ──────────────────────────────────────────────────────────────────────────────

const matchesFilter = (
  item: TNotificationItem,
  filter: TNotificationFilter,
) => {
  switch (filter) {
    case 'needs_action': {
      return NOTIFICATION_ACTION_VIEWS[item.action].isBlocking && !item.isRead;
    }
    case 'unread': {
      return !item.isRead;
    }
    default: {
      return true;
    }
  }
};

/**
 * Toàn bộ logic màn Thông báo: nhóm đang lọc, số đếm cho từng nhóm và việc
 * đánh dấu đã đọc.
 */
export function useNotifications() {
  const [filter, setFilter] = useState<TNotificationFilter>('all');
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );

  // Đọc rồi thì giữ trong một tập id riêng thay vì sửa `MOCK_NOTIFICATIONS`:
  // dữ liệu gốc phải bất biến để khi nối API chỉ cần thay đúng mảng đó.
  const notifications = useMemo(
    () =>
      MOCK_NOTIFICATIONS.map(item =>
        readIds.has(item.id) ? { ...item, isRead: true } : item,
      ),
    [readIds],
  );

  const counts = useMemo(
    () => ({
      all: notifications.length,
      needs_action: notifications.filter(item =>
        matchesFilter(item, 'needs_action'),
      ).length,
      unread: notifications.filter(item => matchesFilter(item, 'unread'))
        .length,
    }),
    [notifications],
  );

  const items = useMemo(
    () => notifications.filter(item => matchesFilter(item, filter)),
    [filter, notifications],
  );

  const onChangeFilter = useCallback((next: TNotificationFilter) => {
    setFilter(next);
  }, []);

  const onAcknowledge = useCallback((id: string) => {
    setReadIds(current => new Set([...current, id]));
  }, []);

  const onReadAll = useCallback(() => {
    setReadIds(new Set(MOCK_NOTIFICATIONS.map(item => item.id)));
  }, []);

  // Chưa có màn đích cho từng loại thông báo: chỗ nối sẵn cho sau.
  const onOpen = useCallback(() => {}, []);

  return {
    counts,
    filter,
    items,
    onAcknowledge,
    onChangeFilter,
    onOpen,
    onReadAll,
  };
}
