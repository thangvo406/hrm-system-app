import type { LayoutChangeEvent } from 'react-native';
import type {
  THomeBalance,
  THomeEmployee,
  THomeNotification,
  THomeShift,
  TShiftPunctuality,
} from '@type/home';

import AppNavigator from '@navigation/AppNavigator';
import { AccountSelector, AttendanceSelector } from '@services/selectors';
import { AppConstants } from '@constants';
import { getCurrentTime } from '@utils/date';
import { getInitials } from '@utils/profile';
import { Paths } from '@navigation/paths';
import { StatusBar } from 'react-native';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getProfileRequest } from '@services/slices/account/accountSlice';

const MORNING_END_HOUR = 12;
const AFTERNOON_END_HOUR = 18;
const ISO_DATE_FORMAT = 'YYYY-MM-DD';

/** Trống nghĩa là hồ sơ chưa nạp xong — thà để trắng còn hơn hiện tên người khác. */
const EMPTY_VALUE = '';

// ─── Mock data ────────────────────────────────────────────────────────────────
// Dữ liệu dựng UI, chưa nối API. Khi có endpoint thật thì thay 4 hằng dưới đây
// bằng saga callback (xem flow ở .cursorrules §5) và bỏ luôn khối này.

/**
 * Mã nhân viên và phòng ban vẫn là dữ liệu dựng: kiểu `Profile` của API chưa có
 * hai trường này. Tên và chữ viết tắt thì đọc từ redux, xem `employee` bên dưới.
 */
const MOCK_EMPLOYEE: THomeEmployee = {
  code: 'NV0142',
  department: 'Phòng Kỹ thuật',
  fullName: EMPTY_VALUE,
  initials: EMPTY_VALUE,
  unreadNotifications: 3,
};

const MOCK_BALANCE: THomeBalance = {
  pendingRequests: 2,
  remainingLeaveDays: 12,
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

/**
 * Kết luận giờ vào ca so với giờ bắt đầu ca hành chính.
 *
 * So sánh thẳng hai chuỗi `HH:mm`: cả hai đều đủ hai chữ số nên thứ tự chữ cái
 * trùng với thứ tự thời gian, khỏi cần plugin `customParseFormat` của dayjs.
 */
const getPunctuality = (checkInAt: string | undefined): TShiftPunctuality => {
  if (!checkInAt) {
    return 'not_checked_in';
  }
  return checkInAt > AppConstants.OFFICE_SHIFT.START_AT ? 'late' : 'on_time';
};

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
  const [headerHeight, setHeaderHeight] = useState(0);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const checkInAt = useAppSelector(AttendanceSelector.getCheckInAt);
  const checkOutAt = useAppSelector(AttendanceSelector.getCheckOutAt);
  const workDate = useAppSelector(AttendanceSelector.getWorkDate);
  const profile = useAppSelector(AccountSelector.getProfile);

  /**
   * Tên và chữ viết tắt lấy thẳng từ redux (`account.profile`, do
   * `getProfileRequest` nạp mỗi lần tab này được focus), giống màn Cá nhân.
   */
  const employee = useMemo<THomeEmployee>(
    () => ({
      ...MOCK_EMPLOYEE,
      fullName: profile?.fullName ?? EMPTY_VALUE,
      initials: getInitials(profile?.fullName),
    }),
    [profile],
  );

  const shift = useMemo<THomeShift>(() => {
    const isToday = workDate === getCurrentTime().format(ISO_DATE_FORMAT);
    const todayCheckInAt = isToday ? checkInAt : undefined;

    return {
      checkInAt: todayCheckInAt,
      checkOutAt: isToday ? checkOutAt : undefined,
      endWorkingTime: AppConstants.OFFICE_SHIFT.END_AT,
      name: t('home.shift_office_name'),
      punctuality: getPunctuality(todayCheckInAt),
      startWorkingTime: AppConstants.OFFICE_SHIFT.START_AT,
    };
  }, [checkInAt, checkOutAt, t, workDate]);

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
      dispatch(getProfileRequest());
      return () => StatusBar.setBarStyle('dark-content');
    }, []),
  );

  const onCheckOut = useCallback(() => {
    AppNavigator.navigate(Paths.Attendance);
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
    employee,
    greetingKey: getGreetingKey(getCurrentTime().hour()),
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
