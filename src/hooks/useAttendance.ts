import type MapView from 'react-native-maps';
import type {
  TAttendanceInfo,
  TAttendanceLogEntry,
  TAttendanceMethod,
  TAttendanceMode,
  TCurrentLocation,
  TOfficeInfo,
} from '@type/attendance';

import AppNavigator from '@navigation/AppNavigator';
import Geolocation from '@react-native-community/geolocation';
import { AccountSelector, AttendanceSelector } from '@services/selectors';
import { AppConstants } from '@constants';
import { getTimeByTimezone, isTodayWorkDate } from '@utils/date';
import {
  checkInRequest,
  checkOutRequest,
} from '@services/slices/attendance/attendanceSlice';
import { DeviceUtils } from '@kits/core/utils';
import { AttendanceUtils, LocationUtils, PermissionUtils } from '@utils';
import { Paths } from '@navigation/paths';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { getListOfficeRequest } from '@services/slices/account/accountSlice';
import { EAttendanceMode, EAttendanceType } from '@constants/config';

const getLocationPermission = () =>
  DeviceUtils.isIOS()
    ? PermissionUtils.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PermissionUtils.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

export function useAttendance() {
  const mapRef = useRef<MapView>(null);
  const isMountedRef = useRef(true);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const storedCheckInAt = useAppSelector(AttendanceSelector.getCheckInAt);
  const storedCheckOutAt = useAppSelector(AttendanceSelector.getCheckOutAt);
  // Bản ghi chấm công hôm nay do server trả về: chỗ duy nhất biết mỗi dấu được
  // chấm bằng GPS hay QR, app không tự suy ra từ tab đang chọn được.
  const attendanceInfo = useAppSelector(AttendanceSelector.getAttendanceInfo);
  const offices = useAppSelector(AccountSelector.getOffices) || [];
  const workDate = useAppSelector(AttendanceSelector.getWorkDate);
  const companyId = useAppSelector(AccountSelector.getProfile)?.companyId;

  // Dấu chấm công được persist nên phải chốt theo ngày: mở app sáng hôm sau là
  // ngày công mới, chưa có dấu nào.
  const isToday = isTodayWorkDate(workDate);
  const checkedInAt = isToday ? storedCheckInAt : undefined;
  const checkedOutAt = isToday ? storedCheckOutAt : undefined;

  const checkedInMethod = checkedInAt
    ? AttendanceUtils.toMethod(attendanceInfo?.checkInMethod)
    : undefined;
  const checkedOutMethod = checkedOutAt
    ? AttendanceUtils.toMethod(attendanceInfo?.checkOutMethod)
    : undefined;

  const [mode, setMode] = useState<TAttendanceMode>(EAttendanceMode.GPS);

  const [currentLocation, setCurrentLocation] = useState<TCurrentLocation>({
    hasPermission: false,
    isLocating: false,
    isMocked: false,
  });

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  const refreshLocation = useCallback(async () => {
    const result = await PermissionUtils.requestPermission(
      getLocationPermission(),
    );
    if (!isMountedRef.current) {
      return;
    }

    const isGranted = result === PermissionUtils.RESULTS.GRANTED;
    if (!isGranted) {
      setCurrentLocation(previous => ({ ...previous, hasPermission: false }));
      return;
    }

    setCurrentLocation(previous => ({
      ...previous,
      hasPermission: true,
      isLocating: true,
    }));

    try {
      const position = await LocationUtils.getCurrentPosition();
      if (!isMountedRef.current) {
        return;
      }
      const { latitude, longitude } = position.coords;
      setCurrentLocation(previous => ({
        ...previous,
        coordinates: { latitude, longitude },
        isLocating: false,
        isMocked: LocationUtils.isMockedPosition(position),
      }));
      mapRef.current?.animateToRegion({
        latitude,
        latitudeDelta: AppConstants.MAP_REGION_DELTA,
        longitude,
        longitudeDelta: AppConstants.MAP_REGION_DELTA,
      });
    } catch {
      // Gồm cả `PositionTimeoutError`: không có hạn chót đó thì nhánh fused
      // của Play Services có thể không gọi callback nào, và spinner sẽ quay mãi.
      if (isMountedRef.current) {
        setCurrentLocation(previous => ({ ...previous, isLocating: false }));
      }
    }
  }, []);

  useEffect(() => {
    Geolocation.setRNConfiguration({
      authorizationLevel: 'whenInUse',
      locationProvider: 'playServices',
      skipPermissionRequests: true,
    });
  }, []);

  const loadOffices = useCallback(() => {
    // if (companyId === undefined) {
    //   return;
    // }

    dispatch(
      getListOfficeRequest({
        // companyId,
      }),
    );
  }, [companyId, dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadOffices();
      void refreshLocation();
    }, [loadOffices, refreshLocation]),
  );

  const attendanceData = useMemo(() => {
    const { coordinates, isMocked } = currentLocation;
    const nearestOffice = coordinates
      ? AttendanceUtils.findNearestOffice(offices, coordinates)
      : undefined;
    const office = nearestOffice?.office ?? offices[0];
    const distanceInMeters = nearestOffice?.distanceInMeters;
    const officePlace = office
      ? [office.name, office.floor].filter(Boolean).join(' · ')
      : '';

    // Bán kính geofence do server quy định riêng cho từng văn phòng, không còn
    // là hằng số chung của app.
    const geofenceRadius = office?.radiusCheckInCircle ?? 0;
    const isInsideLocation =
      distanceInMeters !== undefined && distanceInMeters <= geofenceRadius;
    const toLogTitle = (
      labelKey: string,
      method: TAttendanceMethod | undefined,
    ) =>
      method
        ? t('attendance.log.with_method', {
            label: t(labelKey),
            method: t(AttendanceUtils.METHOD_LABEL_KEYS[method]),
          })
        : t(labelKey);

    return {
      attendanceInfo: { checkedInAt, checkedOutAt } satisfies TAttendanceInfo,
      distanceInMeters,
      enableBtnCheckin: isInsideLocation && !isMocked && !checkedOutAt,
      geofenceRadius,
      isInsideLocation,
      logEntries: [
        {
          at: checkedInAt,
          icon: 'ic_sign_in',
          id: 'check-in',
          place: checkedInAt ? officePlace : t('attendance.log.pending'),
          title: toLogTitle('attendance.log.check_in', checkedInMethod),
        },
        {
          at: checkedOutAt,
          icon: 'ic_sign_out',
          id: 'check-out',
          place: checkedOutAt ? officePlace : t('attendance.log.pending'),
          title: toLogTitle('attendance.log.check_out', checkedOutMethod),
        },
      ] satisfies readonly TAttendanceLogEntry[],
      officeInfo: office
        ? ({
            coordinates: AttendanceUtils.getOfficeCoordinates(office),
            name: office.name,
            // Giờ hành chính đi theo văn phòng chứ không phải hằng số chung
            // của app — mỗi chi nhánh vào ca một giờ khác nhau là bình thường.
            shift: {
              endWorkingTime: getTimeByTimezone(
                office.endWorkingTime,
                office.timezone,
              ),
              name: t('attendance.shift_office_name'),
              startWorkingTime: getTimeByTimezone(
                office.startWorkingTime,
                office.timezone,
              ),
            },
          } satisfies TOfficeInfo)
        : undefined,
    };
  }, [
    checkedInAt,
    checkedInMethod,
    checkedOutAt,
    checkedOutMethod,
    currentLocation,
    offices,
    t,
  ]);

  const onPressAttendance = useCallback(() => {
    if (!attendanceData.enableBtnCheckin) {
      return;
    }

    const { coordinates } = currentLocation;
    if (!coordinates) {
      return;
    }

    const request = {
      latitude: String(coordinates.latitude),
      longitude: String(coordinates.longitude),
    };
    const executor = checkedInAt ? checkOutRequest : checkInRequest;
    const type = checkedInAt
      ? EAttendanceType.CHECK_OUT
      : EAttendanceType.CHECK_IN;
    dispatch(
      executor({
        ...request,
        method: mode,
        type,
        ...AttendanceUtils.toPunch(dayjs().toISOString()),
        onFailure: (error: string) => {
          AppNavigator.showSnackBar({
            message: error,
            type: 'failed',
          });
        },
      }),
    );
  }, [
    attendanceData.enableBtnCheckin,
    checkedInAt,
    currentLocation,
    dispatch,
    mode,
  ]);

  const onPressHistory = useCallback(() => {
    AppNavigator.navigate(Paths.AttendanceHistories);
  }, []);

  const onPressExplanation = useCallback(() => {
    AppNavigator.navigate(Paths.Requests);
  }, []);

  const onGoBack = useCallback(() => {
    AppNavigator.goBack();
  }, []);

  const onPressLocate = useCallback(() => {
    void refreshLocation();
  }, [refreshLocation]);

  return {
    ...attendanceData,
    currentLocation,
    mapRef,
    mode,
    onGoBack,
    onPressAttendance,
    onPressExplanation,
    onPressHistory,
    onPressLocate,
    setMode,
  };
}
