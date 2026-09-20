import type { LayoutChangeEvent } from 'react-native';
import type {
  THomeBalance,
  THomeEmployee,
  THomeNotification,
  THomeShift,
} from '@type/home';

import AppNavigator from '@navigation/AppNavigator';
import dayjs from 'dayjs';
import { Paths } from '@navigation/paths';
import { StatusBar } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const MORNING_END_HOUR = 12;
const AFTERNOON_END_HOUR = 18;
const TIME_FORMAT = 'HH:mm';

// ─── Mock data ────────────────────────────────────────────────────────────────
// Dữ liệu dựng UI, chưa nối API. Khi có endpoint thật thì thay 4 hằng dưới đây
// bằng saga callback (xem flow ở .cursorrules §5) và bỏ luôn khối này.

const MOCK_EMPLOYEE: THomeEmployee = {
  code: 'NV0142',
  department: 'Phòng Kỹ thuật',
  fullName: 'Nguyễn Minh Thư',
  initials: 'MT',
  unreadNotifications: 3,
};

const MOCK_SHIFT: THomeShift = {
  checkInAt: '08:26',
  checkOutAt: undefined,
  endAt: '17:30',
  name: 'Ca hành chính',
  punctuality: 'on_time',
  startAt: '08:30',
};

const MOCK_BALANCE: THomeBalance = {
  pendingRequests: 2,
  remainingLeaveDays: 6.5,
  totalLeaveDays: 12,
};

const MOCK_NOTIFICATIONS: readonly THomeNotification[] = [
  {
    icon: 'ic_megaphone',
    id: 'notify-attendance-policy',
    needsAction: true,
    source: 'Phòng Nhân sự',
    timeAgo: '2 giờ trước',
    title: 'Quy định chấm công từ 01/10',
    tone: 'urgent',
  },
  {
    icon: 'ic_check',
    id: 'notify-leave-approved',
    needsAction: false,
    source: 'Trần Quốc Hưng',
    timeAgo: 'Hôm qua',
    title: 'Đơn nghỉ phép 24–25/09 đã được duyệt',
    tone: 'success',
  },
];

// ──────────────────────────────────────────────────────────────────────────────

/** Khớp giờ hiện tại với lời chào ở header (sáng / chiều / tối). */
const getGreetingKey = (hour: number) => {
  if (hour < MORNING_END_HOUR) {
    return 'home.greeting_morning';
  }
  return hour < AFTERNOON_END_HOUR
    ? 'home.greeting_afternoon'
    : 'home.greeting_evening';
};

/**
 * Toàn bộ logic màn Trang chủ: hồ sơ nhân viên, ca làm việc hôm nay, số dư phép
 * và thông báo mới, kèm các hành động điều hướng.
 */
export function useHome() {
  const [shift, setShift] = useState<THomeShift>(MOCK_SHIFT);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Ảnh nền navy phải trải liền từ header xuống dải `HeaderOverlap`, mà hai
  // view đó nằm ở hai cây khác nhau (header ghim cố định, dải nằm trong vùng
  // cuộn). Phải đo header ở đây rồi đưa xuống cả hai để chúng vẽ cùng một khung
  // ảnh — xem ghi chú ở `screens/Home/layout.ts`.
  const onHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  // Header nền navy nên status bar phải sáng; trả lại dark-content khi rời tab
  // để các màn nền trắng không mất chữ.
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      return () => StatusBar.setBarStyle('dark-content');
    }, []),
  );

  const onCheckOut = useCallback(() => {
    setShift(previous => ({
      ...previous,
      checkOutAt: dayjs().format(TIME_FORMAT),
    }));
  }, []);

  const onPressNotificationCenter = useCallback(() => {
    AppNavigator.navigate(Paths.Notifications);
  }, []);

  const onPressQuickAction = useCallback((path: Paths) => {
    AppNavigator.navigate(path);
  }, []);

  const onPressBalance = useCallback(() => {
    AppNavigator.navigate(Paths.Requests);
  }, []);

  return {
    balance: MOCK_BALANCE,
    employee: MOCK_EMPLOYEE,
    greetingKey: getGreetingKey(dayjs().hour()),
    headerHeight,
    notifications: MOCK_NOTIFICATIONS,
    onCheckOut,
    onHeaderLayout,
    onPressBalance,
    onPressNotificationCenter,
    onPressQuickAction,
    shift,
  };
}
