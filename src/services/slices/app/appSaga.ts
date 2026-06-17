import type { PayloadAction } from '@reduxjs/toolkit';
import type { StartupAppPayload } from './appSlice';

import { AuthSelector } from '@services/selectors';
import { delay, put, select, takeLatest } from 'redux-saga/effects';

import { incrementAsync, incrementAsyncSuccess, startupApp } from './appSlice';

const ASYNC_DELAY = 1000;
const STARTUP_DELAY = 1000;
const STARTUP_ERROR = 'startup_error';

export function* appSaga() {
  yield takeLatest(incrementAsync.type, incrementAsyncWorker);
  yield takeLatest(startupApp.type, startupAppWorker);
}

function* incrementAsyncWorker(action: PayloadAction<number>) {
  yield delay(ASYNC_DELAY);
  yield put(incrementAsyncSuccess(action.payload));
}

function* startupAppWorker(action: PayloadAction<StartupAppPayload>) {
  try {
    // Splash hold while any future bootstrap work runs (config, i18n, …).
    yield delay(STARTUP_DELAY);
    const accessToken: string | undefined = yield select(
      AuthSelector.getAccessToken,
    );
    const isAuthenticated = Boolean(accessToken);
    // if (isAuthenticated) {
    //   yield put(getProfileRequest());
    // }
    action.payload.onSuccess?.(isAuthenticated);
  } catch {
    action.payload.onFailure?.(STARTUP_ERROR);
  }
}
