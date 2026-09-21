import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IRequestLogin,
  IResponseLogin,
  IResponseRefreshToken,
} from '@type/auth';

import {
  login,
  logout as logoutRequest,
  refreshToken,
} from '@services/request/auth';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { persistor } from '@services/common/store';

import {
  authSuccess,
  loginRequest,
  logout,
  logoutSuccess,
  refreshTokenRequest,
  setCredentials,
} from './authSlice';
import { Globals } from '@utils';
import { AuthSelector } from '@services/selectors';
import { OneSignal } from 'react-native-onesignal';
import { AppStorage } from '@services/common/storage';
import { AppConstants } from '@constants';

const LOGOUT_PURGE_DELAY_MS = 130;

function* loginWorker(action: PayloadAction<IRequestLogin>) {
  const { onFailure, onSuccess, rememberMe, ...request } = action.payload;
  try {
    // const response = {};
    const response: IResponseLogin = yield call(login, request);
    if (rememberMe) {
      AppStorage.set(AppConstants.REMEMBERED_EMAIL_KEY, request.username);
    } else {
      AppStorage.remove(AppConstants.REMEMBERED_EMAIL_KEY);
    }
    yield put(authSuccess(response));
    onSuccess?.(response);
  } catch (error: any) {
    onFailure?.(error?.response?.data);
  }
}

function* refreshTokenWorker() {
  try {
    const refreshTokenString: string = yield select(
      AuthSelector.getRefreshToken,
    );
    const data: IResponseRefreshToken = yield call(
      refreshToken,
      refreshTokenString,
    );
    yield put(setCredentials(data));
  } catch {
    // Giữ nguyên token cũ; interceptor ở instance.ts mới là chỗ xử lý 401.
  }
}

// Reducers reset in-memory state synchronously when `logout` is dispatched.
// This worker additionally wipes the persisted MMKV storage so tokens and
// profile data do not survive an app restart.
function* logoutWorker() {
  Globals.hasUpdateDeviceId = false;
  const refreshTokenString: string = yield select(AuthSelector.getRefreshToken);
  try {
    if (refreshTokenString) {
      yield call(logoutRequest, { refreshToken: refreshTokenString });
    }
  } catch {
    //TODO: handle error
  }
  yield delay(LOGOUT_PURGE_DELAY_MS);
  yield call([persistor, 'purge']);
  yield put(logoutSuccess());
  if (Globals.isOneSignalInitialized) {
    OneSignal.Notifications.clearAll();
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(refreshTokenRequest.type, refreshTokenWorker);
  yield takeLatest(logout.type, logoutWorker);
}
