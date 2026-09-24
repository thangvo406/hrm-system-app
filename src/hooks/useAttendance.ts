import type MapView from 'react-native-maps';
import type {
  TAttendanceInfo,
  TAttendanceLogEntry,
  TAttendanceMode,
  TCurrentLocation,
  TOfficeInfo,
} from '@type/attendance';

import AppNavigator from '@navigation/AppNavigator';
import Geolocation from '@react-native-community/geolocation';
import { AccountSelector, AttendanceSelector } from '@services/selectors';
import { AppConstants } from '@constants';
import { getCurrentTime, getTimeByTimezone } from '@utils/date';
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

const POSITION_TIMEOUT_MS = 15_000;
const POSITION_MAX_AGE_MS = 10_000;

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
  const offices = useAppSelector(AccountSelector.getOffices) || [];
  const workDate = useAppSelector(AttendanceSelector.getWorkDate);
  const companyId = useAppSelector(AccountSelector.getProfile)?.companyId;

  // Dấu chấm công được persist nên phải chốt theo ngày: mở app sáng hôm sau là
  // ngày công mới, chưa có dấu nào.
  const isToday =
    workDate === getCurrentTime().format(AttendanceUtils.ISO_DATE_FORMAT);
  const checkedInAt = isToday ? storedCheckInAt : undefined;
  const checkedOutAt = isToday ? storedCheckOutAt : undefined;

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
    Geolocation.getCurrentPosition(
      position => {
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
      },
      () => {
        if (isMountedRef.current) {
          setCurrentLocation(previous => ({ ...previous, isLocating: false }));
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
    Geolocation.setRNConfiguration({
      authorizationLevel: 'whenInUse',
      locationProvider: 'auto',
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
    const geofenceRadius = office?.radiusInMeters ?? 0;
    const isInsideLocation =
      distanceInMeters !== undefined && distanceInMeters <= geofenceRadius;

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
          place: checkedInAt ? officePlace : t('attendance.log_pending'),
          // Cách chấm chỉ có nghĩa khi đã chấm thật; chưa chấm thì chỉ nêu tên
          // dấu.
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
          place: checkedOutAt ? officePlace : t('attendance.log_pending'),
          title: t('attendance.log_check_out'),
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
  }, [checkedInAt, checkedOutAt, currentLocation, offices, t]);

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
  }, [attendanceData.enableBtnCheckin, checkedInAt, currentLocation, dispatch]);

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
