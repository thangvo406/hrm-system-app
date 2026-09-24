import type {
  IOffice,
  TAttendancePunch,
  TNearestOffice,
} from '@type/attendance';
import * as LocationUtils from './location';
import { getOnlyDate, getOnlyTime } from './date';

export const toPunch = (isoTimestamp: string): TAttendancePunch => ({
  at: getOnlyTime(isoTimestamp),
  workDate: getOnlyDate(isoTimestamp),
});

export const getOfficeCoordinates = (
  office: IOffice,
): LocationUtils.TCoordinates => ({
  latitude: Number(office.latitude),
  longitude: Number(office.longitude),
});

/**
 * Văn phòng gần `from` nhất trong danh sách, kèm khoảng cách.
 *
 * Luôn lấy văn phòng gần nhất, không có ngưỡng khoảng cách nào cả: ở cách 50 m
 * hay 50 km thì vẫn là văn phòng đó. Việc đứng đủ gần để được chấm công là
 * chuyện riêng của geofence (`IOffice.radiusInMeters`), xét ở chỗ khác.
 *
 * Trả `undefined` khi danh sách rỗng: không có văn phòng nào khác hẳn với "có
 * văn phòng nhưng ở xa", gộp lại là chỗ gọi hết đường phân biệt.
 *
 * Bỏ qua văn phòng có toạ độ không parse được (chuỗi rỗng, dữ liệu hỏng) —
 * `Number('')` ra 0, để lọt thì hoá ra một điểm ngoài khơi vịnh Guinea.
 */
export const findNearestOffice = (
  offices: readonly IOffice[],
  from: LocationUtils.TCoordinates,
): TNearestOffice | undefined => {
  let nearest: TNearestOffice | undefined;

  for (const office of offices) {
    const coordinates = getOfficeCoordinates(office);
    if (
      Number.isNaN(coordinates.latitude) ||
      Number.isNaN(coordinates.longitude)
    ) {
      continue;
    }

    const distanceInMeters = LocationUtils.getDistanceInMeters(
      from,
      coordinates,
    );
    if (nearest && nearest.distanceInMeters <= distanceInMeters) {
      continue;
    }

    nearest = { distanceInMeters, office };
  }

  return nearest;
};
