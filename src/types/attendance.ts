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

/** Ca làm việc được phân của hôm nay. */
export type TAttendanceShift = {
  readonly endAt: string;
  readonly name: string;
  readonly startAt: string;
};
