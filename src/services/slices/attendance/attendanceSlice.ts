import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IRequestAttendance,
  IRequestGetAttendanceHistories,
  IResponseAttendanceInfo,
  TAttendancePunch,
} from '@type/attendance';

import { createSlice } from '@reduxjs/toolkit';

import { logoutSuccess } from '@services/slices/auth/authSlice';
import { AttendanceUtils } from '@utils';

export type AttendanceState = {
  checkInAt: string | undefined;
  checkOutAt: string | undefined;

  workDate: string | undefined;
  attendanceInfo: IResponseAttendanceInfo | undefined;
};

const initialState: AttendanceState = {
  checkInAt: undefined,
  checkOutAt: undefined,
  workDate: undefined,
  attendanceInfo: undefined,
};

const attendanceSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(logoutSuccess, () => initialState);
  },
  initialState,
  name: 'attendance',
  reducers: {
    // Vào ca mở một ngày công mới, nên xoá luôn dấu ra ca của ngày trước đó.
    checkinSuccess: (state, action: PayloadAction<TAttendancePunch>) => {
      state.checkInAt = action.payload.at;
      state.checkOutAt = undefined;
      state.workDate = action.payload.workDate;
    },
    checkoutSuccess: (state, action: PayloadAction<TAttendancePunch>) => {
      state.checkOutAt = action.payload.at;
      state.workDate = action.payload.workDate;
    },
    checkInRequest: {
      prepare: (payload: IRequestAttendance) => ({ payload }),
      reducer: () => {},
    },
    getAttendanceInfoSuccess: (
      state,
      action: PayloadAction<IResponseAttendanceInfo>,
    ) => {
      try {
        const checkIn = AttendanceUtils.toPunch(action.payload?.checkInTime);
        const checkOut = AttendanceUtils.toPunch(action.payload?.checkOutTime);
        state.checkOutAt = checkOut.at;
        state.workDate = checkIn.workDate;
        state.checkInAt = checkIn.at;

        state.attendanceInfo = action.payload;
      } catch (error) {
        console.log('errr', error?.message);
      }
    },
    getAttendanceInfoRequest: {
      prepare: () => ({ payload: undefined }),
      reducer: () => {},
    },
    getAttendanceHistoriesRequest: {
      prepare: (payload: IRequestGetAttendanceHistories) => ({ payload }),
      reducer: () => {},
    },
    checkOutRequest: {
      prepare: (payload: IRequestAttendance) => ({ payload }),
      reducer: () => {},
    },
    resetAttendance: () => initialState,
  },
});

export const {
  checkinSuccess,
  checkInRequest,
  checkoutSuccess,
  checkOutRequest,
  resetAttendance,
  getAttendanceInfoRequest,
  getAttendanceInfoSuccess,
  getAttendanceHistoriesRequest,
} = attendanceSlice.actions;

export const attendanceReducer = attendanceSlice.reducer;
