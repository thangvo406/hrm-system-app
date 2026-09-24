import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IRequestAttendance,
  IRequestGetAttendanceHistories,
  IResponseAttendanceInfo,
} from '@type/attendance';
import type { ListApiResponse } from '@type/common';

import { call, put, takeLatest } from 'redux-saga/effects';

import {
  attendanceInfo,
  checkIn,
  checkOut,
  getAttendanceHistories,
} from '@services/request/attendance';
import {
  checkInRequest,
  checkOutRequest,
  getAttendanceHistoriesRequest,
  getAttendanceInfoRequest,
  getAttendanceInfoSuccess,
} from './attendanceSlice';
import { getErrorMessageApi } from '@utils/common';

function* checkInWorker(action: PayloadAction<IRequestAttendance>) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseAttendanceInfo = yield call(checkIn, request);
    onSuccess?.(response);
    yield put(getAttendanceInfoSuccess(response));
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

function* checkOutWorker(action: PayloadAction<IRequestAttendance>) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseAttendanceInfo = yield call(checkOut, request);
    onSuccess?.(response);
    yield put(getAttendanceInfoSuccess(response));
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

function* attendanceInfoWorker() {
  try {
    const response: IResponseAttendanceInfo = yield call(attendanceInfo);
    yield put(getAttendanceInfoSuccess(response));
  } catch {
    //TODO:
  }
}

function* getAttendanceHistoriesWorker(
  action: PayloadAction<IRequestGetAttendanceHistories>,
) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: ListApiResponse<IResponseAttendanceInfo[]> = yield call(
      getAttendanceHistories,
      request,
    );
    onSuccess?.(response);
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

export function* attendanceSaga() {
  yield takeLatest(checkInRequest.type, checkInWorker);
  yield takeLatest(checkOutRequest.type, checkOutWorker);
  yield takeLatest(getAttendanceInfoRequest.type, attendanceInfoWorker);
  yield takeLatest(
    getAttendanceHistoriesRequest.type,
    getAttendanceHistoriesWorker,
  );
}
