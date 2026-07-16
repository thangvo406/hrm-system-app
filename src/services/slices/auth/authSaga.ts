import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse } from '@services/request/auth';
import type {
  IRequestConfirmMemberShipVerify,
  IRequestGetUniversities,
  IRequestLogin,
  IRequestLoginSocial,
  IRequestSendOtpVerifyMembership,
  IRequestRegisterUser,
  IRequestSendOTP,
  IRequestSendOtpForgotPass,
  IRequestSubmitForgotPass,
  IRequestVerifyOTP,
  IRequestVerifyOtpForgotPass,
} from '@type/auth';

import {
  confirmMemberShipVerify,
  getUniversities,
  login,
  loginSocial,
  sendOtpVerifyMembership,
  registerUser,
  selectSchool,
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
  confirmMemberShipVerifyRequest,
  getUniversitiesRequest,
  loginRequest,
  loginSocialRequest,
  logout,
  logoutSuccess,
  sendOtpVerifyMembershipRequest,
  refreshTokenRequest,
  registerUserRequest,
  selectSchoolRequest,
  selectSchoolSuccess,
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
  IResponseRefreshToken,
  ISelectSchoolRequest,
  IResponseSendOtpVerifyMembership,
  IResponseConfirmMemberShipVerify,
} from '@type/auth';
import { Globals } from '@utils';
import { AccountSelector, AuthSelector } from '@services/selectors';
import { deletePushId } from '@services/request/account';
import { getErrorMessageApi } from '@utils/common';

function* loginWorker(action: PayloadAction<IRequestLogin>) {
  try {
    const response: AuthResponse = yield call(login, action.payload);
    yield put(authSuccess(response));
    action.payload.onSuccess?.(response);
  } catch (error: any) {
    action.payload.onFailure?.(error?.response?.data);
    // yield put(authFailure(toErrorMessage(error)));
  }
}

function* loginSocialWorker(action: PayloadAction<IRequestLoginSocial>) {
  try {
    const response: AuthResponse = yield call(loginSocial, action.payload);
    yield put(authSuccess(response));
    action.payload.onSuccess?.();
  } catch (error: any) {
    action.payload.onFailure?.(error?.response?.data);
    // yield put(authFailure(toErrorMessage(error)));
  }
}

function* registerUserWorker(action: PayloadAction<IRequestRegisterUser>) {
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

function* sendOTPWorker(action: PayloadAction<IRequestSendOTP>) {
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

function* verifyOTPWorker(action: PayloadAction<IRequestVerifyOTP>) {
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
    const data: IResponseRefreshToken = yield call(
      refreshToken,
      refreshTokenString,
    );
    yield put(setCredentials(data));
    // action.payload.onSuccess?.();
  } catch {
    // action.payload.onFailure?.('');
  }
}

function* getUniversitiesWorker(action: PayloadAction<IRequestGetUniversities>) {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    const response: IResponseUniversity[] = yield call(
      getUniversities,
      request,
    );
    onSuccess?.(response);
  } catch {
    onFailure?.('');
  }
}

function* sendOtpForgotPassWorker(
  action: PayloadAction<IRequestSendOtpForgotPass>,
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
  action: PayloadAction<IRequestVerifyOtpForgotPass>,
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
  action: PayloadAction<IRequestSubmitForgotPass>,
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

function* sendOtpVerifyMembershipWorker(
  action: PayloadAction<IRequestSendOtpVerifyMembership>,
) {
  try {
    const response: IResponseSendOtpVerifyMembership = yield call(
      sendOtpVerifyMembership,
      action.payload,
    );
    action.payload.onSuccess?.(response);
  } catch (error) {
    action.payload.onFailure?.(getErrorMessageApi(error));
  }
}

function* confirmMemberShipVerifyWorker(
  action: PayloadAction<IRequestConfirmMemberShipVerify>,
) {
  try {
    const response: IResponseConfirmMemberShipVerify = yield call(
      confirmMemberShipVerify,
      action.payload,
    );
    action.payload.onSuccess?.(response);
  } catch (error) {
    action.payload.onFailure?.(getErrorMessageApi(error));
  }
}

function* selectSchoolWorker(action: PayloadAction<ISelectSchoolRequest>) {
  try {
    yield call(selectSchool, action.payload);
    yield put(
      selectSchoolSuccess({ universityId: action.payload?.universityId }),
    );
    action.payload.onSuccess?.();
  } catch (error) {
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
    if (pushId) {
      yield call(deletePushId, pushId);
    }
    if (refreshToken) {
      yield call(logoutRequest, { refreshToken });
    }
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
  yield takeLatest(getUniversitiesRequest.type, getUniversitiesWorker);
  yield takeLatest(sendOtpForgotPassRequest.type, sendOtpForgotPassWorker);
  yield takeLatest(verifyOtpForgotPassRequest.type, verifyOtpForgotPassWorker);
  yield takeLatest(submitForgotPassRequest.type, submitForgotPassWorker);
  yield takeLatest(
    sendOtpVerifyMembershipRequest.type,
    sendOtpVerifyMembershipWorker,
  );
  yield takeLatest(
    confirmMemberShipVerifyRequest.type,
    confirmMemberShipVerifyWorker,
  );
  yield takeLatest(selectSchoolRequest.type, selectSchoolWorker);
  yield takeLatest(logout.type, logoutWorker);
  yield takeLatest(refreshTokenRequest.type, refreshTokenWorker);
}
