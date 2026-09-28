import type { LayoutChangeEvent } from 'react-native';
import {
  IResponseHomeInfo,
  type THomeEmployee,
  type THomeShift,
  type TShiftPunctuality,
} from '@type/home';

import type { TCoordinates } from '@utils/location';

import AppNavigator from '@navigation/AppNavigator';
import { AccountSelector, AttendanceSelector } from '@services/selectors';
import { AppConstants } from '@constants';
import { AttendanceUtils, LocationUtils, PermissionUtils } from '@utils';
import { DeviceUtils } from '@kits/core/utils';
import {
  getCurrentTime,
  getTimeByTimezone,
  isTodayWorkDate,
} from '@utils/date';
import { getInitials } from '@utils/profile';
import { Paths } from '@navigation/paths';
import { StatusBar } from 'react-native';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  getListOfficeRequest,
  getProfileRequest,
} from '@services/slices/account/accountSlice';
import { getAttendanceInfoRequest } from '@services/slices/attendance/attendanceSlice';
import { getHomeInfoRequest } from '@services/slices/home/homeSlice';

const MORNING_END_HOUR = 12;
const AFTERNOON_END_HOUR = 18;

const getLocationPermission = () =>
  DeviceUtils.isIOS()
    ? PermissionUtils.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PermissionUtils.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

/** Trống nghĩa là hồ sơ chưa nạp xong — thà để trắng còn hơn hiện tên người khác. */
const EMPTY_VALUE = '';

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

const getPunctuality = (
  checkInAt: string | undefined,
  startWorkingTime: string,
): TShiftPunctuality => {
  if (!checkInAt) {
    return 'not_checked_in';
  }
  return checkInAt > startWorkingTime ? 'late' : 'on_time';
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

export function useHome() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const checkInAt = useAppSelector(AttendanceSelector.getCheckInAt);
  const checkOutAt = useAppSelector(AttendanceSelector.getCheckOutAt);
  const workDate = useAppSelector(AttendanceSelector.getWorkDate);
  const profile = useAppSelector(AccountSelector.getProfile);
  const attendanceInfo = useAppSelector(AttendanceSelector.getAttendanceInfo);
  const offices = useAppSelector(AccountSelector.getOffices) || [];
  const [homeInfo, setHomeInfo] = useState<IResponseHomeInfo | undefined>();

  const [coordinates, setCoordinates] = useState<TCoordinates | undefined>();
  const isMountedRef = useRef(true);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  const refreshLocation = useCallback(async () => {
    try {
      const result = await PermissionUtils.requestPermission(
        getLocationPermission(),
      );
      if (result !== PermissionUtils.RESULTS.GRANTED) {
        return;
      }

      const position = await LocationUtils.getCurrentPosition();
      if (isMountedRef.current) {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }
    } catch {
      // Không lấy được vị trí thì vẫn hiện được ca, chỉ kém chính xác hơn.
    }
  }, []);

  const employee = useMemo<THomeEmployee>(
    () => ({
      ...MOCK_EMPLOYEE,
      fullName: profile?.fullName ?? EMPTY_VALUE,
      initials: getInitials(profile?.fullName),
    }),
    [profile],
  );

  const office = useMemo(() => {
    if (attendanceInfo?.office) {
      return attendanceInfo.office;
    }
    const nearest = coordinates
      ? AttendanceUtils.findNearestOffice(offices, coordinates)
      : undefined;
    return nearest?.office ?? offices[0];
  }, [attendanceInfo?.office, coordinates, offices]);

  const shift = useMemo<THomeShift>(() => {
    const isToday = isTodayWorkDate(workDate);
    const todayCheckInAt = isToday ? checkInAt : undefined;

    // Chưa tải được văn phòng nào thì vẫn phải hiện được giờ hành chính, nên
    // rơi về hằng số dự phòng thay vì để trống.
    const startWorkingTime =
      getTimeByTimezone(office?.startWorkingTime, office?.timezone) ||
      AppConstants.OFFICE_SHIFT.START_AT;

    return {
      checkInAt: todayCheckInAt,
      checkOutAt: isToday ? checkOutAt : undefined,
      endWorkingTime:
        getTimeByTimezone(office?.endWorkingTime, office?.timezone) ||
        AppConstants.OFFICE_SHIFT.END_AT,
      name: t('home.shift_office_name'),
      // So với giờ vào ca CỦA CHÍNH văn phòng đó, không phải hằng số chung:
      // mỗi chi nhánh vào ca một giờ khác nhau là chuyện bình thường.
      punctuality: getPunctuality(todayCheckInAt, startWorkingTime),
      startWorkingTime,
    };
  }, [checkInAt, checkOutAt, office, t, workDate]);

  const onHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      dispatch(getProfileRequest());
      dispatch(getAttendanceInfoRequest());
      dispatch(getListOfficeRequest({}));
      dispatch(
        getHomeInfoRequest({
          onSuccess: data => {
            setHomeInfo(data);
          },
        }),
      );
      void refreshLocation();
      return () => StatusBar.setBarStyle('dark-content');
    }, [dispatch, refreshLocation]),
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
