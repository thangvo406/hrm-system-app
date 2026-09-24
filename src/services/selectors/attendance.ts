import type { RootState } from '@services/common/store';
import { IResponseAttendanceInfo } from '@type';

const getCheckInAt = (state: RootState): string | undefined =>
  state.attendance.checkInAt;
const getCheckOutAt = (state: RootState): string | undefined =>
  state.attendance.checkOutAt;
const getWorkDate = (state: RootState): string | undefined =>
  state.attendance.workDate;

const getAttendanceInfo = (
  state: RootState,
): IResponseAttendanceInfo | undefined => state.attendance.attendanceInfo;

export const AttendanceSelector = {
  getCheckInAt,
  getCheckOutAt,
  getAttendanceInfo,
  getWorkDate,
};
