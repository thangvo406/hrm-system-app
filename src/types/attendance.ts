import type { AppCallback, ListApiResponse } from '@type/common';
import type { EAttendanceMode, EAttendanceStatus } from '@constants/config';
import type { IconName } from '@assets/icons';
import type { TCoordinates } from '@utils/location';

/** Cách chấm công đang chọn ở đầu màn Chấm công. */
export type TAttendanceMode = EAttendanceMode;

/** Một dòng trong "Nhật ký hôm nay": dấu vào ca hoặc ra ca. */
export type TAttendanceLogEntry = {
  /** `undefined` khi chưa chấm công, dòng hiển thị mờ với `--:--`. */
  readonly at?: string;
  readonly icon: IconName;
  readonly id: string;
  /** Nơi chấm công, hoặc câu trạng thái khi chưa chấm. */
  readonly place: string;
  readonly title: string;
};

/** Một dấu chấm công vừa ghi nhận, kèm ngày công mà nó thuộc về. */
export type TAttendancePunch = {
  /** Giờ chấm, định dạng `HH:mm`. */
  readonly at: string;
  /** Ngày công, định dạng `YYYY-MM-DD`. */
  readonly workDate: string;
};

/** Ca làm việc được phân của hôm nay. */
export type TAttendanceShift = {
  readonly endWorkingTime: string;
  readonly name: string;
  readonly startWorkingTime: string;
};

/** Kết luận chấm công của một ngày. */
export type TAttendanceStatus = 'early_leave' | 'late' | 'missing' | 'on_time';

export type TAttendanceHistoryFilter = 'all' | EAttendanceStatus;

/** Cách chấm công của một dấu: định vị hay quét mã. */
export type TAttendanceMethod = EAttendanceMode;

/** Một ngày công trong lịch sử chấm công. */
export type TAttendanceHistoryEntry = {
  /** `undefined` khi chưa chấm công vào ca. */
  readonly checkInAt?: string;
  readonly checkInMethod?: TAttendanceMethod;
  /** `undefined` khi chưa chấm công ra ca. */
  readonly checkOutAt?: string;
  readonly checkOutMethod?: TAttendanceMethod;
  /** Dạng `YYYY-MM-DD`. */
  readonly date: string;
  /** Thiết bị đã chấm vào ca, hiện cạnh cách chấm. */
  readonly checkInDevice?: string;
  /** Thiết bị đã chấm ra ca — có thể khác máy chấm vào ca. */
  readonly checkOutDevice?: string;
  readonly id: string;
  readonly status: TAttendanceStatus;
  /** `undefined` khi chưa đủ hai dấu để tính giờ làm. */
  readonly workedHours?: number;
  readonly workedMinutes?: number;
};

/** Một ô ngày trên dải tuần ở đầu danh sách. */
export type TAttendanceWeekDay = {
  /** Dạng `YYYY-MM-DD`. */
  readonly date: string;
  readonly dayNumber: number;
  readonly id: string;
  /** `undefined` khi ngày đó không có dữ liệu chấm công. */
  readonly status?: TAttendanceStatus;
  /** Khoá i18n của tên thứ viết tắt (`date.date_range.mon`...). */
  readonly weekdayKey: string;
};

/** Một văn phòng được phép chấm công, do server cấu hình. */
export interface IOffice {
  address?: string;
  code: string;
  /** Giờ tan ca hành chính của văn phòng này, `HH:mm` 24 giờ. */
  endWorkingTime: string;
  timezone: string;
  floor?: string;
  id: number;
  latitude: string;
  longitude: string;
  name: string;
  /**
   * Bán kính geofence tính bằng mét, riêng cho từng văn phòng.
   *
   * Có field này rồi thì bỏ được hằng `GEOFENCE_RADIUS_M` đang hardcode trong
   * `useAttendance` — mỗi chi nhánh một bán kính khác nhau là chuyện bình thường.
   */
  radiusCheckInCircle: number;
  /** Giờ vào ca hành chính của văn phòng này, `HH:mm` 24 giờ. */
  startWorkingTime: string;
}

export type TNearestOffice = {
  readonly distanceInMeters: number;
  readonly office: IOffice;
};

export type TOfficeInfo = {
  readonly coordinates: TCoordinates;
  readonly name: string;
  /** Ca hành chính của chính văn phòng này, không phải ca chung của công ty. */
  readonly shift: TAttendanceShift;
};

export type TCurrentLocation = {
  readonly coordinates?: TCoordinates;
  /** `false` cho tới khi người dùng đồng ý cấp quyền vị trí. */
  readonly hasPermission: boolean;
  readonly isLocating: boolean;
  /** `true` khi hệ điều hành báo toạ độ do app giả lập vị trí bơm vào. */
  readonly isMocked: boolean;
};

export type TAttendanceInfo = {
  readonly checkedInAt?: string;
  readonly checkedOutAt?: string;
};

export interface IResponseAttendanceInfo {
  checkInTime: string;
  checkOutTime: string;
  checkInLatitude: number;
  checkInLongitude: number;
  checkOutLatitude: number;
  checkOutLongitude: number;
  checkInMethod?: TAttendanceMethod;
  checkOutMethod?: TAttendanceMethod;
  checkInDeviceName: string;
  checkOutDeviceName: string;
  type: string;
  status: string;
  note: string;
  user: IAttendanceUser;
  office: IOffice;
}

export interface IAttendanceUser {
  username: string;
  email: string;
}

export interface IRequestAttendance
  extends AppCallback<IResponseAttendanceInfo> {
  latitude: string;
  longitude: string;
  type: 'CHECK_OUT' | 'CHECK_IN';
  method: 'GPS' | 'QR_CODE';
}

export interface IRequestGetAttendanceHistories
  extends AppCallback<ListApiResponse<IResponseAttendanceInfo[]>> {
  page: number;
  size: number;
  status: string;
  month: string;
}
export interface IRequestGetListOffice {
  companyId?: number;
}
