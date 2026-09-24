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

const POSITION_TIMEOUT_MS = 30_000;
const POSITION_MAX_AGE_MS = 30_000;

const POSITION_HARD_TIMEOUT_MS = 35_000;

const TIMED_OUT = Symbol('position-timed-out');

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

/** Ném ra khi hết `POSITION_HARD_TIMEOUT_MS` mà vẫn chưa có toạ độ. */
export class PositionTimeoutError extends Error {
  constructor() {
    super('Timed out while getting the current position');
    this.name = 'PositionTimeoutError';
  }
}

/**
 * `Geolocation.getCurrentPosition` ở dạng promise, kèm hạn chót tự đặt để
 * không bao giờ treo mãi — xem `POSITION_HARD_TIMEOUT_MS`. Mọi chỗ cần toạ độ
 * nên đi qua đây thay vì gọi thẳng `Geolocation`.
 */
export const getCurrentPosition = async (
  hardTimeoutMs: number = POSITION_HARD_TIMEOUT_MS,
): Promise<GeolocationResponse> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const position = new Promise<GeolocationResponse>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      resolve,
      error => {
        reject(new Error(error.message));
      },
      {
        enableHighAccuracy: true,
        maximumAge: POSITION_MAX_AGE_MS,
        timeout: POSITION_TIMEOUT_MS,
      },
    );
  });

  const expiry = new Promise<typeof TIMED_OUT>(resolve => {
    timeoutId = setTimeout(() => {
      resolve(TIMED_OUT);
    }, hardTimeoutMs);
  });

  try {
    const winner = await Promise.race([position, expiry]);
    if (winner === TIMED_OUT) {
      throw new PositionTimeoutError();
    }
    return winner;
  } finally {
    // Nhánh thua vẫn còn treo; ít nhất đừng giữ timer sống thêm.
    clearTimeout(timeoutId);
  }
};

export const getCurrentCoordinates = async (): Promise<TDevicePosition> => {
  const permission = DeviceUtils.isIOS()
    ? PermissionUtils.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PermissionUtils.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  const result = await PermissionUtils.requestPermission(permission);

  if (result !== PermissionUtils.RESULTS.GRANTED) {
    throw new Error(`Location permission not granted: ${result}`);
  }

  const position = await getCurrentPosition();
  return {
    isMocked: isMockedPosition(position),
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
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
