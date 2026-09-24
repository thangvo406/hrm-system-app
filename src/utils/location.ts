import type { TDevicePosition, TGeolocationPosition } from '@type/location';
import type { GeolocationResponse } from '@react-native-community/geolocation';

import Geolocation from '@react-native-community/geolocation';
import * as PermissionUtils from './permissions';
import { DeviceUtils } from '@kits/core/utils';

export type TCoordinates = {
  readonly latitude: number;
  readonly longitude: number;
};

/** Bán kính mặc định coi là "đang ở tại chỗ đó", tính bằng mét. */
export const DEFAULT_NEARBY_RADIUS_M = 50;

const EARTH_RADIUS_M = 6_371_000;
const DEGREES_IN_HALF_TURN = 180;
const HALF = 2;

const POSITION_TIMEOUT_MS = 15_000;
const POSITION_MAX_AGE_MS = 10_000;

const toRadians = (degrees: number) =>
  (degrees * Math.PI) / DEGREES_IN_HALF_TURN;

export const getDistanceInMeters = (
  from: TCoordinates,
  to: TCoordinates,
): number => {
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLng = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(deltaLat / HALF) ** HALF +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(deltaLng / HALF) ** HALF;
  return EARTH_RADIUS_M * HALF * Math.asin(Math.sqrt(a));
};

/** `true` khi hai điểm cách nhau không quá `radiusInMeters`. */
export const isWithinRadius = (
  from: TCoordinates,
  to: TCoordinates,
  radiusInMeters: number = DEFAULT_NEARBY_RADIUS_M,
): boolean => getDistanceInMeters(from, to) <= radiusInMeters;

export const isMockedPosition = (position: GeolocationResponse): boolean =>
  (position as TGeolocationPosition).mocked === true;

export const getCurrentCoordinates = async (): Promise<TDevicePosition> => {
  const permission = DeviceUtils.isIOS()
    ? PermissionUtils.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PermissionUtils.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  const result = await PermissionUtils.requestPermission(permission);

  if (result !== PermissionUtils.RESULTS.GRANTED) {
    throw new Error(`Location permission not granted: ${result}`);
  }

  return new Promise<TDevicePosition>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position =>
        resolve({
          isMocked: isMockedPosition(position),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      error => reject(new Error(error.message)),
      {
        enableHighAccuracy: true,
        maximumAge: POSITION_MAX_AGE_MS,
        timeout: POSITION_TIMEOUT_MS,
      },
    );
  });
};

export const getDistanceToCurrentPosition = async (
  target: TCoordinates,
): Promise<number> =>
  getDistanceInMeters(await getCurrentCoordinates(), target);

export const isCurrentPositionNear = async (
  target: TCoordinates,
  radiusInMeters: number = DEFAULT_NEARBY_RADIUS_M,
): Promise<boolean> =>
  (await getDistanceToCurrentPosition(target)) <= radiusInMeters;
