import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse } from '@services/request/auth';
import type { LoginPayload, RegisterPayload } from './authSlice';

import { login, register } from '@services/request/auth';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import {
  authFailure,
  authSuccess,
  loginRequest,
  registerRequest,
} from './authSlice';

const DEFAULT_ERROR = 'common_error';

const toErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)
      ?.message;
    return message ?? error.message;
  }
  return DEFAULT_ERROR;
};

function* loginWorker(action: PayloadAction<LoginPayload>) {
  try {
    const response: AuthResponse = yield call(login, action.payload);
    alert('loginWorker');
    yield put(authSuccess(response));
    action.payload.onSuccess?.();
  } catch (error) {
    yield put(authFailure(toErrorMessage(error)));
    // alert(error?.message);
    action.payload.onFailure?.(toErrorMessage(error));
  }
}

function* registerWorker(action: PayloadAction<RegisterPayload>) {
  try {
    const response: AuthResponse = yield call(register, action.payload);
    yield put(authSuccess(response));
    action.payload.onSuccess?.();
  } catch (error) {
    yield put(authFailure(toErrorMessage(error)));
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(registerRequest.type, registerWorker);
}
