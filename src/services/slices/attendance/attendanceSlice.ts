import type { PayloadAction } from '@reduxjs/toolkit';
import type { TAttendancePunch } from '@type/attendance';

import { createSlice } from '@reduxjs/toolkit';

import { logoutSuccess } from '@services/slices/auth/authSlice';

export type AttendanceState = {
  /** `undefined` khi chưa chấm công vào ca — đây là trạng thái khởi tạo. */
  checkInAt: string | undefined;
  /** `undefined` khi chưa chấm công ra ca. */
  checkOutAt: string | undefined;
  /**
   * Ngày (`YYYY-MM-DD`) của hai dấu ở trên. State được persist nên nếu không
   * chốt ngày thì dấu chấm công hôm qua sẽ hiện lại vào sáng hôm sau.
   */
  workDate: string | undefined;
};

const initialState: AttendanceState = {
  checkInAt: undefined,
  checkOutAt: undefined,
  workDate: undefined,
};

const attendanceSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(logoutSuccess, () => initialState);
  },
  initialState,
  name: 'attendance',
  reducers: {
    // Vào ca mở một ngày công mới, nên xoá luôn dấu ra ca của ngày trước đó.
    checkedIn: (state, action: PayloadAction<TAttendancePunch>) => {
      state.checkInAt = action.payload.at;
      state.checkOutAt = undefined;
      state.workDate = action.payload.workDate;
    },
    checkedOut: (state, action: PayloadAction<TAttendancePunch>) => {
      state.checkOutAt = action.payload.at;
      state.workDate = action.payload.workDate;
    },
    resetAttendance: () => initialState,
  },
});

export const { checkedIn, checkedOut, resetAttendance } =
  attendanceSlice.actions;

export const attendanceReducer = attendanceSlice.reducer;
