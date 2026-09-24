import type { IconName } from '@assets/icons';
import type {
  IOffice,
  IResponseAttendanceInfo,
  TAttendanceHistoryEntry,
  TAttendanceHistoryFilter,
  TAttendanceMethod,
  TAttendancePunch,
  TAttendanceStatus,
  TNearestOffice,
} from '@type/attendance';
import dayjs from 'dayjs';
import * as LocationUtils from './location';
import { EAttendanceMode, EAttendanceStatus } from '@constants/config';
import { getOnlyDate, getOnlyTime, MINUTES_PER_HOUR } from './date';

export const toPunch = (isoTimestamp: string): TAttendancePunch => ({
  at: getOnlyTime(isoTimestamp),
  workDate: getOnlyDate(isoTimestamp),
});

/** Đối chiếu `status` server trả về (chuỗi tự do) với kết luận app hiểu được. */
const STATUS_BY_API_VALUE: Record<string, TAttendanceStatus> = {
  [EAttendanceStatus.ABSENT]: 'missing',
  [EAttendanceStatus.EARLY_LEAVE]: 'early_leave',
  [EAttendanceStatus.FULL_TIME]: 'on_time',
  [EAttendanceStatus.LATE]: 'late',
};

const ATTENDANCE_METHODS = new Set<string>(Object.values(EAttendanceMode));

export const METHOD_ICONS: Record<TAttendanceMethod, IconName> = {
  [EAttendanceMode.GPS]: 'ic_location',
  [EAttendanceMode.QR_CODE]: 'ic_qr_scan',
};

export const METHOD_LABEL_KEYS: Record<TAttendanceMethod, string> = {
  [EAttendanceMode.GPS]: 'attendance.methods.gps',
  [EAttendanceMode.QR_CODE]: 'attendance.methods.qr',
};

export const FILTER_LABEL_KEYS = {
  all: 'attendance_histories.filters.all',
  [EAttendanceStatus.EARLY_LEAVE]: 'attendance_histories.filters.early',
  [EAttendanceStatus.FULL_TIME]: 'attendance_histories.filters.on_time',
  [EAttendanceStatus.LATE]: 'attendance_histories.filters.late',
  // `satisfies` chứ không phải annotation: nhờ vậy tra bằng khoá tĩnh (hàng
  // chip) ra thẳng `string`, còn tra bằng biến thì chỗ gọi tự nới kiểu và xử lý
  // `undefined`.
} satisfies Partial<Record<TAttendanceHistoryFilter, string>>;

export const toMethod = (
  value: string | undefined,
): TAttendanceMethod | undefined =>
  value && ATTENDANCE_METHODS.has(value)
    ? (value as TAttendanceMethod)
    : undefined;

export const toHistoryEntry = (
  item: IResponseAttendanceInfo,
  index: number,
): TAttendanceHistoryEntry => {
  const date = getOnlyDate(item.checkInTime) || getOnlyDate(item.checkOutTime);
  // Chỉ tính giờ làm khi có ĐỦ hai dấu — thiếu một dấu thì con số nào cũng sai.
  const workedMinutesTotal =
    item.checkInTime && item.checkOutTime
      ? dayjs(item.checkOutTime).diff(dayjs(item.checkInTime), 'minute')
      : undefined;

  return {
    checkInAt: getOnlyTime(item.checkInTime) || undefined,
    checkInMethod: toMethod(item.checkInMethod),
    checkOutAt: getOnlyTime(item.checkOutTime) || undefined,
    checkOutMethod: toMethod(item.checkOutMethod),
    date,
    checkInDevice: item.checkInDeviceName || undefined,
    checkOutDevice: item.checkOutDeviceName || undefined,
    id: `day-${date}-${index}`,
    status: STATUS_BY_API_VALUE[item.status] ?? 'missing',
    workedHours:
      workedMinutesTotal === undefined
        ? undefined
        : Math.floor(workedMinutesTotal / MINUTES_PER_HOUR),
    workedMinutes:
      workedMinutesTotal === undefined
        ? undefined
        : workedMinutesTotal % MINUTES_PER_HOUR,
  };
};

export const getOfficeCoordinates = (
  office: IOffice,
): LocationUtils.TCoordinates => ({
  latitude: Number(office.latitude),
  longitude: Number(office.longitude),
});

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
