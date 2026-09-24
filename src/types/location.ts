import type { GeolocationResponse } from '@react-native-community/geolocation';

export type TGeolocationPosition = {
  readonly mocked?: boolean;
} & GeolocationResponse;

export type TDevicePosition = {
  /** `true` khi hệ điều hành báo toạ độ này do app giả lập vị trí bơm vào. */
  readonly isMocked: boolean;
  readonly latitude: number;
  readonly longitude: number;
};
