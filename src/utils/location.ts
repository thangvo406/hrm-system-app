import Geolocation from '@react-native-community/geolocation';
// Import thẳng file sibling chứ không qua '@utils': index.ts re-export chính
// file này, đi vòng qua đó là tạo circular import.
import * as PermissionUtils from './permissions';
import { DeviceUtils } from '@kits/core/utils';

/** Một điểm trên bản đồ, khớp luôn với `Region` của react-native-maps. */
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

/**
 * Khoảng cách đường chim bay giữa hai toạ độ, tính bằng mét.
 *
 * Dùng Haversine (coi Trái Đất là hình cầu). Sai số so với mô hình ellipsoid
 * dưới 0.5%, tức vài centimet ở khoảng cách vài trăm mét — thừa chính xác cho
 * việc khoanh vùng chấm công.
 */
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

/**
 * Toạ độ hiện tại của thiết bị.
 *
 * Tự xin quyền vị trí trước (giống cách `utils/imagePicker.ts` tự xin quyền
 * camera), nên chỗ gọi không phải lo phần đó.
 *
 * NÉM LỖI thay vì trả `undefined` khi người dùng từ chối quyền hoặc máy không
 * định vị được: hai chuyện đó khác hẳn "đang đứng xa", gộp chung vào một giá
 * trị rỗng là mời gọi chỗ gọi hiểu nhầm thành ngoài vùng.
 */
export const getCurrentCoordinates = async (): Promise<TCoordinates> => {
  const permission = DeviceUtils.isIOS()
    ? PermissionUtils.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PermissionUtils.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  const result = await PermissionUtils.requestPermission(permission);

  if (result !== PermissionUtils.RESULTS.GRANTED) {
    throw new Error(`Location permission not granted: ${result}`);
  }

  return new Promise<TCoordinates>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position =>
        resolve({
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

/**
 * Khoảng cách từ chỗ đang đứng tới `target`, tính bằng mét.
 *
 * Ném lỗi theo đúng `getCurrentCoordinates` khi không lấy được vị trí.
 */
export const getDistanceToCurrentPosition = async (
  target: TCoordinates,
): Promise<number> =>
  getDistanceInMeters(await getCurrentCoordinates(), target);

/**
 * `true` khi thiết bị đang ở cách `target` không quá `radiusInMeters`
 * (mặc định 50 m).
 *
 * Ném lỗi khi thiếu quyền vị trí hoặc không định vị được — bọc try/catch ở chỗ
 * gọi và xử lý riêng trường hợp đó, đừng coi như ở xa.
 */
export const isCurrentPositionNear = async (
  target: TCoordinates,
  radiusInMeters: number = DEFAULT_NEARBY_RADIUS_M,
): Promise<boolean> =>
  (await getDistanceToCurrentPosition(target)) <= radiusInMeters;
