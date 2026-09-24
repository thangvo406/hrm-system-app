import type { PayloadAction } from '@reduxjs/toolkit';
import type { IRequestAttendance, IResponseAttendance } from '@type/attendance';

import { call, put, takeLatest } from 'redux-saga/effects';

import { checkIn, checkOut } from '@services/request/attendance';
import {
  checkInRequest,
  checkinSuccess,
  checkOutRequest,
  checkoutSuccess,
} from './attendanceSlice';
import { getErrorMessageApi } from '@utils/common';

function* checkInWorker(action: PayloadAction<IRequestAttendance>) {
  // Bóc callback ra khỏi payload TRƯỚC khi gọi API: chúng là chuyện của redux,
  // đẩy nguyên payload xuống là gửi cả hai hàm đó lên server.
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseAttendance = yield call(checkIn, request);
    onSuccess?.(response);
    yield put(checkinSuccess(request));
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

function* checkOutWorker(action: PayloadAction<IRequestAttendance>) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseAttendance = yield call(checkOut, request);
    onSuccess?.(response);
    yield put(checkoutSuccess(request));
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

export function* attendanceSaga() {
  yield takeLatest(checkInRequest.type, checkInWorker);
  yield takeLatest(checkOutRequest.type, checkOutWorker);
}
