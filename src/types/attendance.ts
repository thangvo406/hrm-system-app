import type { IconName } from '@assets/icons';

/** Cách chấm công đang chọn ở đầu màn Chấm công. */
export type TAttendanceMode = 'gps' | 'qr';

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
  readonly endAt: string;
  readonly name: string;
  readonly startAt: string;
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
export type TAttendanceMethod = 'gps' | 'qr';

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
