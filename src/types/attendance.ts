import type { AppCallback } from '@type/common';
import type { EAttendanceMode } from '@constants/config';
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

export type TAttendanceHistoryFilter =
  | 'all'
  | 'check_in'
  | 'check_out'
  | 'early_leave'
  | 'late';

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
  /** Thiết bị đã chấm công, hiện cạnh cách chấm. */
  readonly device?: string;
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
  radiusInMeters: number;
  /** Giờ vào ca hành chính của văn phòng này, `HH:mm` 24 giờ. */
  startWorkingTime: string;
}

/**
 * Văn phòng gần chỗ đang đứng nhất, kèm khoảng cách đã tính sẵn.
 *
 * Gói chung ba giá trị thay vì trả mỗi `IOffice`: chỗ gọi nào cũng cần khoảng
 * cách ngay sau đó, tính lại là quét Haversine lần hai trên cùng bộ dữ liệu.
 */
export type TNearestOffice = {
  readonly distanceInMeters: number;
  readonly office: IOffice;
};

/**
 * Phần thông tin văn phòng mà màn Chấm công thực sự vẽ ra.
 *
 * Gói lại thay vì rải `officeName` / `officeCoordinates` rời: hai giá trị này
 * luôn cùng có hoặc cùng không (đều lấy từ một `IOffice`), tách rời thì chỗ gọi
 * phải tự nhớ kiểm cả hai.
 */
export type TOfficeInfo = {
  readonly coordinates: TCoordinates;
  readonly name: string;
  /** Ca hành chính của chính văn phòng này, không phải ca chung của công ty. */
  readonly shift: TAttendanceShift;
};

/**
 * Trạng thái định vị hiện tại: toạ độ, đang đo hay không, có bị giả lập không.
 *
 * `coordinates` là `undefined` khi chưa định vị được lần nào — khác hẳn với
 * "đang đo" (`isLocating`), nên giữ hai thứ riêng chứ không suy ra từ nhau.
 */
export type TCurrentLocation = {
  readonly coordinates?: TCoordinates;
  /** `false` cho tới khi người dùng đồng ý cấp quyền vị trí. */
  readonly hasPermission: boolean;
  readonly isLocating: boolean;
  /** `true` khi hệ điều hành báo toạ độ do app giả lập vị trí bơm vào. */
  readonly isMocked: boolean;
};

/** Hai dấu chấm công của ngày công hôm nay. */
export type TAttendanceInfo = {
  /** Giờ vào ca `HH:mm`; `undefined` khi chưa chấm. */
  readonly checkedInAt?: string;
  /** Giờ ra ca `HH:mm`; `undefined` khi chưa chấm. */
  readonly checkedOutAt?: string;
};

/** Dấu chấm công vào ca mà server đã ghi nhận. */
export interface IResponseAttendance {
  checkInAt: string;
  id: number;
  officeId: number;
}

export interface IRequestAttendance extends AppCallback<IResponseAttendance> {
  latitude: string;
  longitude: string;
  type: 'CHECK_OUT' | 'CHECK_IN';
  method: 'GPS' | 'QR_CODE';
}

export interface IRequestGetListOffice {
  companyId?: number;
}
