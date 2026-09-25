import type { PayloadAction } from '@reduxjs/toolkit';
import type { IRequestGetHomeInfo, IResponseLeaveSummary } from '@type/home';

import { call, takeLatest } from 'redux-saga/effects';

import { getLeaveSummary } from '@services/request/home';
import { getHomeInfoRequest } from './homeSlice';
import { getErrorMessageApi } from '@utils/common';

function* getHomeInfoWorker(action: PayloadAction<IRequestGetHomeInfo>) {
  const { onFailure, onSuccess } = action.payload;
  try {
    const response: IResponseLeaveSummary = yield call(getLeaveSummary);
    onSuccess?.({
      leaveSummary: response,
      notifications: undefined,
    });
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

export function* homeSaga() {
  yield takeLatest(getHomeInfoRequest.type, getHomeInfoWorker);
}
