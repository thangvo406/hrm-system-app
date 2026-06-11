import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse } from '@services/request/auth';
import type {
  CompleteRegisterPayload,
  LoginPayload,
  RegisterPayload,
  RegisterUserPayload,
  SendOTPPayload,
  VerifyOTPPayload,
} from './authSlice';

import {
  completeRegister,
  login,
  register,
  registerUser,
  sendOTP,
  verifyOTP,
} from '@services/request/auth';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { persistor } from '@services/common/store';

import {
  authFailure,
  authSuccess,
  completeRegisterRequest,
  loginRequest,
  logout,
  registerRequest,
  registerUserRequest,
  sendOTPRequest,
  verifyOTPRequest,
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

const toErrorStatus = (error: unknown): number | undefined =>
  axios.isAxiosError(error) ? error.response?.status : undefined;

function* loginWorker(action: PayloadAction<LoginPayload>) {
  try {
    const response: AuthResponse = yield call(login, action.payload);
    yield put(authSuccess(response));
    action.payload.onSuccess?.();
  } catch (error) {
    action.payload.onFailure?.(error?.response?.data);
    yield put(authFailure(toErrorMessage(error)));
  }
}

function* registerWorker(action: PayloadAction<RegisterPayload>) {
  try {
    yield call(register, action.payload);
    // yield put(authSuccess(response));
    action.payload.onSuccess?.();
  } catch (error) {
    console.log('error', error);
    yield put(authFailure(toErrorMessage(error)));
  }
}

function* registerUserWorker(action: PayloadAction<RegisterUserPayload>) {
  try {
    // alert('registerUserWorker');
    yield call(registerUser, action.payload);
    // yield put(authSuccess(response));
    action.payload.onSuccess?.();
  } catch (error) {
    console.log('error', error?.message);
    yield put(authFailure(toErrorMessage(error)));
    action.payload.onFailure?.(toErrorMessage(error));
  }
}

function* sendOTPWorker(action: PayloadAction<SendOTPPayload>) {
  try {
    yield call(sendOTP, action.payload);
    action.payload.onSuccess?.();
  } catch (error) {
    yield put(authFailure(toErrorMessage(error)));
    action.payload.onFailure?.(toErrorMessage(error));
  }
}

function* verifyOTPWorker(action: PayloadAction<VerifyOTPPayload>) {
  try {
    yield call(verifyOTP, action.payload);
    action.payload.onSuccess?.();
  } catch (error) {
    yield put(authFailure(toErrorMessage(error)));
    action.payload.onFailure?.(toErrorMessage(error));
  }
}

function* completeRegisterWorker(
  action: PayloadAction<CompleteRegisterPayload>,
) {
  try {
    const response: AuthResponse = yield call(completeRegister, action.payload);
    yield put(authSuccess(response));
    action.payload.onSuccess?.();
  } catch (error) {
    yield put(authFailure(toErrorMessage(error)));
    action.payload.onFailure?.(toErrorMessage(error));
  }
}

// Reducers reset in-memory state synchronously when `logout` is dispatched.
// This worker additionally wipes the persisted MMKV storage so tokens and
// profile data do not survive an app restart.
function* logoutWorker() {
  yield call([persistor, 'purge']);
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(registerRequest.type, registerWorker);
  yield takeLatest(registerUserRequest.type, registerUserWorker);
  yield takeLatest(sendOTPRequest.type, sendOTPWorker);
  yield takeLatest(verifyOTPRequest.type, verifyOTPWorker);
  yield takeLatest(completeRegisterRequest.type, completeRegisterWorker);
  yield takeLatest(logout.type, logoutWorker);
}
