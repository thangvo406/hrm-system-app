import type { PayloadAction } from '@reduxjs/toolkit';

import { delay, put, takeLatest } from 'redux-saga/effects';

import { incrementAsync, incrementAsyncSuccess } from './appSlice';

const ASYNC_DELAY = 1000;

export function* appSaga() {
  yield takeLatest(incrementAsync.type, incrementAsyncWorker);
}

function* incrementAsyncWorker(action: PayloadAction<number>) {
  yield delay(ASYNC_DELAY);
  yield put(incrementAsyncSuccess(action.payload));
}
