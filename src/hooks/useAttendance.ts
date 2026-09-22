import type MapView from 'react-native-maps';
import type { Region } from 'react-native-maps';
import type { TAttendanceLogEntry, TAttendanceMode } from '@type/attendance';

import AppNavigator from '@navigation/AppNavigator';
import Geolocation from '@react-native-community/geolocation';
import { AppConstants } from '@constants';
import { AttendanceSelector } from '@services/selectors';
import { getCurrentTime } from '@utils/date';
import {
  checkedIn,
  checkedOut,
} from '@services/slices/attendance/attendanceSlice';
import { DeviceUtils } from '@kits/core/utils';
import { LocationUtils, PermissionUtils } from '@utils';
import { Paths } from '@navigation/paths';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const TIME_FORMAT = 'HH:mm';
const ISO_DATE_FORMAT = 'YYYY-MM-DD';

const POSITION_TIMEOUT_MS = 15_000;
const POSITION_MAX_AGE_MS = 10_000;

// ─── Mock data ────────────────────────────────────────────────────────────────
// Dữ liệu dựng UI, chưa nối API. Khi có endpoint thật thì thay các hằng dưới đây
// bằng saga callback (xem flow ở .cursorrules §5) và bỏ luôn khối này.

const OFFICE_NAME = 'Trụ sở Specom';
const OFFICE_FLOOR = 'Tầng 8';

// Bán kính được phép chấm công quanh văn phòng, tính bằng mét. Dưới ngưỡng này
// thì banner báo "trong khu vực" và nút chấm công mở.
const GEOFENCE_RADIUS_M = 50;

// Delta quyết định mức zoom: 0.0012 ≈ 130 m chiều cao khung nhìn, vừa đủ ôm
// trọn vòng tròn 50 m (đường kính 100 m). Nới bán kính thì phải nới cả con số
// này, không thì vòng tròn tràn ra ngoài thẻ bản đồ.
const OFFICE_REGION: Region = {
  latitude: 10.807_057_1,
  latitudeDelta: 0.0012,
  longitude: 106.709_281_3,
  longitudeDelta: 0.0012,
};

// ──────────────────────────────────────────────────────────────────────────────

const getLocationPermission = () =>
  DeviceUtils.isIOS()
    ? PermissionUtils.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PermissionUtils.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

/**
 * Toàn bộ logic màn Chấm công: xin quyền vị trí, đo khoảng cách tới văn phòng,
 * chạy đồng hồ giây và ghi nhận giờ chấm công.
 *
 * Bản đồ dùng `initialRegion` + `animateToRegion` chứ KHÔNG dùng prop `region`
 * có kiểm soát: `region` sẽ kéo bản đồ về state sau mỗi lần render, nên người
 * dùng vừa pan xong là bị giật ngược lại.
 */
export function useAttendance() {
  const mapRef = useRef<MapView>(null);
  const isMountedRef = useRef(true);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const storedCheckInAt = useAppSelector(AttendanceSelector.getCheckInAt);
  const storedCheckOutAt = useAppSelector(AttendanceSelector.getCheckOutAt);
  const workDate = useAppSelector(AttendanceSelector.getWorkDate);

  // Dấu chấm công được persist nên phải chốt theo ngày: mở app sáng hôm sau là
  // ngày công mới, chưa có dấu nào.
  const isToday = workDate === getCurrentTime().format(ISO_DATE_FORMAT);
  const checkedInAt = isToday ? storedCheckInAt : undefined;
  const checkedOutAt = isToday ? storedCheckOutAt : undefined;

  const [mode, setMode] = useState<TAttendanceMode>('gps');
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [distanceInMeters, setDistanceInMeters] = useState<number>();
  const [isLocating, setIsLocating] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] =
    useState<LocationUtils.TCoordinates>();

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  /**
   * Đọc lại vị trí hiện tại, đưa bản đồ về đó và tính lại khoảng cách tới văn
   * phòng. Dùng chung cho lần định vị lúc mở màn và cho nút lấy lại vị trí.
   *
   * Nút bị disable trong lúc đang chạy nên không cần thêm cờ chống gọi chồng.
   */
  const refreshLocation = useCallback(async () => {
    const result = await PermissionUtils.requestPermission(
      getLocationPermission(),
    );
    if (!isMountedRef.current) {
      return;
    }

    const isGranted = result === PermissionUtils.RESULTS.GRANTED;
    setHasLocationPermission(isGranted);
    if (!isGranted) {
      return;
    }

    setIsLocating(true);
    Geolocation.getCurrentPosition(
      position => {
        if (!isMountedRef.current) {
          return;
        }
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        setCurrentCoordinates({ latitude, longitude });
        setDistanceInMeters(
          LocationUtils.getDistanceInMeters(
            { latitude, longitude },
            OFFICE_REGION,
          ),
        );
        mapRef.current?.animateToRegion({
          latitude,
          latitudeDelta: OFFICE_REGION.latitudeDelta,
          longitude,
          longitudeDelta: OFFICE_REGION.longitudeDelta,
        });
      },
      // Không lấy được vị trí thì bản đồ cứ đứng ở chỗ cũ và khoảng cách giữ
      // nguyên giá trị lần đo trước — không chặn người dùng vì lỗi định vị.
      // Nhưng PHẢI tắt cờ loading, nếu không nút kẹt disable vĩnh viễn.
      () => {
        if (isMountedRef.current) {
          setIsLocating(false);
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: POSITION_MAX_AGE_MS,
        timeout: POSITION_TIMEOUT_MS,
      },
    );
  }, []);

  useEffect(() => {
    // Quyền do react-native-permissions xin (thống nhất với phần còn lại của
    // app), nên phải tắt cơ chế tự xin của geolocation để iOS không bật hai
    // popup chồng nhau.
    Geolocation.setRNConfiguration({
      authorizationLevel: 'whenInUse',
      locationProvider: 'auto',
      skipPermissionRequests: true,
    });

    void refreshLocation();
  }, [refreshLocation]);

  const logEntries = useMemo<readonly TAttendanceLogEntry[]>(
    () => [
      {
        at: checkedInAt,
        icon: 'ic_sign_in',
        id: 'check-in',
        place: checkedInAt
          ? `${OFFICE_NAME} · ${OFFICE_FLOOR}`
          : t('attendance.log_pending'),
        // Cách chấm chỉ có nghĩa khi đã chấm thật; chưa chấm thì chỉ nêu tên dấu.
        title: t(
          checkedInAt
            ? 'attendance.log_check_in_method'
            : 'attendance.log_check_in',
        ),
      },
      {
        at: checkedOutAt,
        icon: 'ic_sign_out',
        id: 'check-out',
        place: checkedOutAt
          ? `${OFFICE_NAME} · ${OFFICE_FLOOR}`
          : t('attendance.log_pending'),
        title: t('attendance.log_check_out'),
      },
    ],
    [checkedInAt, checkedOutAt, t],
  );

  /**
   * Một nút cho cả hai dấu: chưa vào ca thì chấm vào, đã vào ca thì chấm ra.
   * Giờ chấm đi thẳng vào redux nên màn Trang chủ đọc lại được ngay.
   */
  const onPunch = useCallback(() => {
    const now = getCurrentTime();
    const punch = {
      at: now.format(TIME_FORMAT),
      workDate: now.format(ISO_DATE_FORMAT),
    };
    dispatch(checkedInAt ? checkedOut(punch) : checkedIn(punch));
  }, [checkedInAt, dispatch]);

  const onPressHistory = useCallback(() => {
    AppNavigator.navigate(Paths.AttendanceHistories);
  }, []);

  const onPressExplanation = useCallback(() => {
    AppNavigator.navigate(Paths.Requests);
  }, []);

  const onGoBack = useCallback(() => {
    AppNavigator.goBack();
  }, []);

  // Bọc lại thành hàm trả void: đưa thẳng một hàm async vào `onPress` là dính
  // @typescript-eslint/no-misused-promises, và lỗi promise sẽ trôi đi lặng lẽ.
  const onPressLocate = useCallback(() => {
    void refreshLocation();
  }, [refreshLocation]);

  return {
    checkedInAt,
    checkedOutAt,
    currentCoordinates,
    distanceInMeters,
    geofenceRadius: GEOFENCE_RADIUS_M,
    hasCheckedIn: !!checkedInAt,
    hasCheckedOut: !!checkedOutAt,
    hasLocationPermission,
    initialRegion: OFFICE_REGION,
    isInsideGeofence:
      distanceInMeters !== undefined && distanceInMeters <= GEOFENCE_RADIUS_M,
    isLocating,
    logEntries,
    mapRef,
    mode,
    officeName: OFFICE_NAME,
    onGoBack,
    onPressExplanation,
    onPressHistory,
    onPressLocate,
    onPunch,
    setMode,
    shift: {
      endAt: AppConstants.OFFICE_SHIFT.END_AT,
      name: t('attendance.shift_office_name'),
      startAt: AppConstants.OFFICE_SHIFT.START_AT,
    },
  };
}
