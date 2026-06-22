import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse } from '@services/request/auth';
import type {
  CompleteRegisterPayload,
  GetUniversitiesPayload,
  LoginPayload,
  LoginSocialPayload,
  RegisterUserPayload,
  SendOTPPayload,
  SendOtpForgotPassPayload,
  SubmitForgotPassPayload,
  VerifyOTPPayload,
  VerifyOtpForgotPassPayload,
} from './authSlice';

import {
  completeRegister,
  getUniversities,
  login,
  loginSocial,
  registerUser,
  sendOTP,
  sendOtpForgotPass,
  submitForgotPass,
  verifyOTP,
  verifyOtpForgotPass,
  logout as logoutRequest,
  refreshToken,
} from '@services/request/auth';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { persistor } from '@services/common/store';

import {
  authFailure,
  authSuccess,
  completeRegisterRequest,
  getUniversitiesRequest,
  loginRequest,
  loginSocialRequest,
  logout,
  logoutSuccess,
  refreshTokenRequest,
  registerUserRequest,
  sendOTPRequest,
  sendOtpForgotPassRequest,
  setCredentials,
  submitForgotPassRequest,
  verifyOTPRequest,
  verifyOtpForgotPassRequest,
} from './authSlice';
import {
  IResponseRegisterSendOtp,
  IResponseRegisterUser,
  IResponseRegisterVerifyOtp,
  IResponseSendOtpForgotPass,
  IResponseSubmitForgotPass,
  IResponseUniversity,
  IResponseVerifyOtpForgotPass,
  ResponseRefreshToken,
} from '@type/auth';
import { Globals } from '@utils';
import { AccountSelector, AuthSelector } from '@services/selectors';
import { deletePushId } from '@services/request/account';
import { getErrorMessageApi } from '@utils/common';

function* loginWorker(action: PayloadAction<LoginPayload>) {
  try {
    const response: AuthResponse = yield call(login, action.payload);
    yield put(authSuccess(response));
    action.payload.onSuccess?.();
  } catch (error: any) {
    action.payload.onFailure?.(error?.response?.data);
    // yield put(authFailure(toErrorMessage(error)));
  }
}

function* loginSocialWorker(action: PayloadAction<LoginSocialPayload>) {
  try {
    const response: AuthResponse = yield call(loginSocial, action.payload);
    yield put(authSuccess(response));
    action.payload.onSuccess?.();
  } catch (error: any) {
    action.payload.onFailure?.(error?.response?.data);
    // yield put(authFailure(toErrorMessage(error)));
  }
}

function* registerUserWorker(action: PayloadAction<RegisterUserPayload>) {
  try {
    // alert('registerUserWorker');
    const response: IResponseRegisterUser = yield call(
      registerUser,
      action.payload,
    );
    // yield put(authSuccess(response));
    action.payload.onSuccess?.(response);
  } catch (error) {
    // yield put(authFailure(toErrorMessage(error)));
    action.payload.onFailure?.(getErrorMessageApi(error));
  }
}

function* sendOTPWorker(action: PayloadAction<SendOTPPayload>) {
  try {
    const response: IResponseRegisterSendOtp = yield call(
      sendOTP,
      action.payload,
    );
    action.payload.onSuccess?.(response);
  } catch (error) {
    // yield put(authFailure(toErrorMessage(error)));
    action.payload.onFailure?.(getErrorMessageApi(error));
  }
}

function* verifyOTPWorker(action: PayloadAction<VerifyOTPPayload>) {
  try {
    const response: IResponseRegisterVerifyOtp = yield call(
      verifyOTP,
      action.payload,
    );
    action.payload.onSuccess?.(response);
  } catch (error) {
    // yield put(authFailure(toErrorMessage(error)));
    action.payload.onFailure?.(getErrorMessageApi(error));
  }
}

function* refreshTokenWorker() {
  try {
    const refreshTokenString: string = yield select(
      AuthSelector.getRefreshToken,
    );
    const data: ResponseRefreshToken = yield call(
      refreshToken,
      refreshTokenString,
    );
    yield put(setCredentials(data));
    // action.payload.onSuccess?.();
  } catch {
    // action.payload.onFailure?.('');
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
    // yield put(authFailure(toErrorMessage(error)));
    action.payload.onFailure?.(getErrorMessageApi(error));
  }
}

function* getUniversitiesWorker(action: PayloadAction<GetUniversitiesPayload>) {
  try {
    const response: IResponseUniversity[] = yield call(getUniversities);
    action.payload.onSuccess?.(response);
  } catch {
    action.payload.onFailure?.('');
  }
}

function* sendOtpForgotPassWorker(
  action: PayloadAction<SendOtpForgotPassPayload>,
) {
  try {
    const response: IResponseSendOtpForgotPass = yield call(
      sendOtpForgotPass,
      action.payload,
    );
    action.payload.onSuccess?.(response);
  } catch (error) {
    yield put(authFailure(getErrorMessageApi(error)));
    action.payload.onFailure?.(getErrorMessageApi(error));
  }
}

function* verifyOtpForgotPassWorker(
  action: PayloadAction<VerifyOtpForgotPassPayload>,
) {
  try {
    const response: IResponseVerifyOtpForgotPass = yield call(
      verifyOtpForgotPass,
      action.payload,
    );
    action.payload.onSuccess?.(response);
  } catch (error) {
    yield put(authFailure(getErrorMessageApi(error)));
    action.payload.onFailure?.(getErrorMessageApi(error));
  }
}

function* submitForgotPassWorker(
  action: PayloadAction<SubmitForgotPassPayload>,
) {
  try {
    const response: IResponseSubmitForgotPass = yield call(
      submitForgotPass,
      action.payload,
    );
    action.payload.onSuccess?.(response);
  } catch (error) {
    // yield put(authFailure(toErrorMessage(error)));
    action.payload.onFailure?.(getErrorMessageApi(error));
  }
}

// Reducers reset in-memory state synchronously when `logout` is dispatched.
// This worker additionally wipes the persisted MMKV storage so tokens and
// profile data do not survive an app restart.
function* logoutWorker() {
  Globals.hasUpdateDeviceId = false;
  const pushId: string = yield select(AccountSelector.getPushId);
  const refreshToken: string = yield select(AuthSelector.getRefreshToken);
  try {
    yield call(deletePushId, pushId);
    yield call(logoutRequest, { refreshToken });
  } catch {
    //TODO: handle error
  }
  yield delay(130);
  yield call([persistor, 'purge']);
  yield put(logoutSuccess());
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(loginSocialRequest.type, loginSocialWorker);
  yield takeLatest(registerUserRequest.type, registerUserWorker);
  yield takeLatest(sendOTPRequest.type, sendOTPWorker);
  yield takeLatest(verifyOTPRequest.type, verifyOTPWorker);
  yield takeLatest(completeRegisterRequest.type, completeRegisterWorker);
  yield takeLatest(getUniversitiesRequest.type, getUniversitiesWorker);
  yield takeLatest(sendOtpForgotPassRequest.type, sendOtpForgotPassWorker);
  yield takeLatest(verifyOtpForgotPassRequest.type, verifyOtpForgotPassWorker);
  yield takeLatest(submitForgotPassRequest.type, submitForgotPassWorker);
  yield takeLatest(logout.type, logoutWorker);
  yield takeLatest(refreshTokenRequest.type, refreshTokenWorker);
}
