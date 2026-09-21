import type { RootState } from '@services/common/store';

const getCheckInAt = (state: RootState): string | undefined =>
  state.attendance.checkInAt;
const getCheckOutAt = (state: RootState): string | undefined =>
  state.attendance.checkOutAt;
const getWorkDate = (state: RootState): string | undefined =>
  state.attendance.workDate;

export const AttendanceSelector = {
  getCheckInAt,
  getCheckOutAt,
  getWorkDate,
};
