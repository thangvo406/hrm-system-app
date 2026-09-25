import type { LayoutChangeEvent } from 'react-native';
import {
  IResponseHomeInfo,
  type THomeEmployee,
  type THomeShift,
  type TShiftPunctuality,
} from '@type/home';

import AppNavigator from '@navigation/AppNavigator';
import { AccountSelector, AttendanceSelector } from '@services/selectors';
import { AppConstants } from '@constants';
import { getCurrentTime, getTimeByTimezone } from '@utils/date';
import { getInitials } from '@utils/profile';
import { Paths } from '@navigation/paths';
import { StatusBar } from 'react-native';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { getProfileRequest } from '@services/slices/account/accountSlice';
import { getAttendanceInfoRequest } from '@services/slices/attendance/attendanceSlice';
import { getHomeInfoRequest } from '@services/slices/home/homeSlice';

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

// const MOCK_NOTIFICATIONS: readonly THomeNotification[] = [
//   {
//     icon: 'ic_megaphone',
//     id: 'notify-attendance-policy',
//     needsAction: true,
//     source: 'Phòng Nhân sự',
//     timeAgo: '2 giờ trước',
//     title: 'Quy định chấm công từ 01/10',
//     tone: 'urgent',
//   },
//   {
//     icon: 'ic_check',
//     id: 'notify-leave-approved',
//     needsAction: false,
//     source: 'Trần Quốc Hưng',
//     timeAgo: 'Hôm qua',
//     title: 'Đơn nghỉ phép 24–25/09 đã được duyệt',
//     tone: 'success',
//   },
// ];

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
  const attendanceInfo = useAppSelector(AttendanceSelector.getAttendanceInfo);
  const [homeInfo, setHomeInfo] = useState<IResponseHomeInfo | undefined>();

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
    const { office } = attendanceInfo || {};
    return {
      checkInAt: todayCheckInAt,
      checkOutAt: isToday ? checkOutAt : undefined,
      endWorkingTime: getTimeByTimezone(
        office?.endWorkingTime,
        office?.timezone,
      ),
      name: t('home.shift_office_name'),
      punctuality: getPunctuality(todayCheckInAt),
      startWorkingTime: getTimeByTimezone(
        office?.startWorkingTime,
        office?.timezone,
      ),
    };
  }, [checkInAt, checkOutAt, t, attendanceInfo?.office, workDate]);

  const onHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      dispatch(getProfileRequest());
      dispatch(getAttendanceInfoRequest());
      dispatch(
        getHomeInfoRequest({
          onSuccess: data => {
            setHomeInfo(data);
          },
        }),
      );
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
    employee,
    greetingKey: getGreetingKey(getCurrentTime().hour()),
    headerHeight,
    onCheckOut,
    onHeaderLayout,
    onPressBalance,
    onPressNotificationCenter,
    onPressQuickAction,
    shift,
    homeInfo,
  };
}
