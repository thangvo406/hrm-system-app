import type { PayloadAction } from '@reduxjs/toolkit';
import type { ListApiResponse } from '@type/common';
import type {
  IRequestConfirmMemberShipVerify,
  IRequestCreateLinkVerifyInfoUser,
  IRequestGetUniversities,
  IRequestLogin,
  IRequestLoginSocial,
  IRequestSendOtpVerifyMembership,
  IRequestRegisterUser,
  IRequestSendOTP,
  IRequestCreateLinkVerifyForgotPass,
  IRequestSubmitForgotPass,
  IRequestVerifyOTP,
  IResponseLogin,
  IRequestVerifyUserNewLogin,
  IResponseCreateLinkVerifyInfoUser,
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
  createLinkVerifyForgotPass,
  submitForgotPass,
  verifyOTP,
  verifyUserNewLogin,
  logout as logoutRequest,
  refreshToken,
  createLinkVerifyInfoUser,
} from '@services/request/auth';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { persistor } from '@services/common/store';

import {
  authFailure,
  authSuccess,
  confirmMemberShipVerifyRequest,
  createLinkVerifyUserRequest,
  getUniversitiesRequest,
  getUniversitiesSuccess,
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
  createLinkVerifyForgotPassRequest,
  setCredentials,
  submitForgotPassRequest,
  verifyOTPRequest,
  verifyUserNewLoginRequest,
} from './authSlice';
import {
  IResponseRegisterSendOtp,
  IResponseRegisterUser,
  IResponseRegisterVerifyOtp,
  IResponseSubmitForgotPass,
  IResponseUniversity,
  IResponseRefreshToken,
  ISelectSchoolRequest,
  IResponseSendOtpVerifyMembership,
  IResponseConfirmMemberShipVerify,
} from '@type/auth';
import { Globals } from '@utils';
import { AccountSelector, AuthSelector } from '@services/selectors';
import { deletePushId } from '@services/request/account';
import { getErrorMessageApi } from '@utils/common';
import { OneSignal } from 'react-native-onesignal';

function* loginWorker(action: PayloadAction<IRequestLogin>) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseLogin = yield call(login, request);
    yield put(authSuccess(response));
    onSuccess?.(response);
  } catch (error: any) {
    onFailure?.(error?.response?.data);
    // yield put(authFailure(toErrorMessage(error)));
  }
}

function* loginSocialWorker(action: PayloadAction<IRequestLoginSocial>) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseLogin = yield call(loginSocial, request);
    yield put(authSuccess(response));
    onSuccess?.(response);
  } catch (error: any) {
    onFailure?.(error?.response?.data);
    // yield put(authFailure(toErrorMessage(error)));
  }
}

function* registerUserWorker(action: PayloadAction<IRequestRegisterUser>) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    // alert('registerUserWorker');
    const response: IResponseRegisterUser = yield call(registerUser, request);
    // yield put(authSuccess(response));
    onSuccess?.(response);
  } catch (error) {
    // yield put(authFailure(toErrorMessage(error)));
    onFailure?.(getErrorMessageApi(error));
  }
}

function* createLinkVerifyUserWorker(
  action: PayloadAction<IRequestCreateLinkVerifyInfoUser>,
) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseCreateLinkVerifyInfoUser = yield call(
      createLinkVerifyInfoUser,
      request,
    );
    onSuccess?.(response);
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

function* sendOTPWorker(action: PayloadAction<IRequestSendOTP>) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseRegisterSendOtp = yield call(sendOTP, request);
    onSuccess?.(response);
  } catch (error) {
    // yield put(authFailure(toErrorMessage(error)));
    onFailure?.(getErrorMessageApi(error));
  }
}

function* verifyOTPWorker(action: PayloadAction<IRequestVerifyOTP>) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseRegisterVerifyOtp = yield call(verifyOTP, request);
    onSuccess?.(response);
  } catch (error) {
    // yield put(authFailure(toErrorMessage(error)));
    onFailure?.(getErrorMessageApi(error));
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

function* getUniversitiesWorker(
  action: PayloadAction<IRequestGetUniversities>,
) {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    const response: ListApiResponse<IResponseUniversity[]> = yield call(
      getUniversities,
      request,
    );
    // Cache only the default (no-keyword) list in the store; search results
    // stay in the screen's local state.
    if (!request.keyword) {
      yield put(
        getUniversitiesSuccess({
          content: response.content,
          last: response.last,
          page: request.page ?? 0,
        }),
      );
    }
    onSuccess?.(response);
  } catch {
    onFailure?.('');
  }
}

function* createLinkVerifyForgotPassWorker(
  action: PayloadAction<IRequestCreateLinkVerifyForgotPass>,
) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseCreateLinkVerifyInfoUser = yield call(
      createLinkVerifyForgotPass,
      request,
    );
    onSuccess?.(response);
  } catch (error) {
    yield put(authFailure(getErrorMessageApi(error)));
    onFailure?.(getErrorMessageApi(error));
  }
}

function* submitForgotPassWorker(
  action: PayloadAction<IRequestSubmitForgotPass>,
) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseSubmitForgotPass = yield call(
      submitForgotPass,
      request,
    );
    onSuccess?.(response);
  } catch (error) {
    // yield put(authFailure(toErrorMessage(error)));
    onFailure?.(getErrorMessageApi(error));
  }
}

function* sendOtpVerifyMembershipWorker(
  action: PayloadAction<IRequestSendOtpVerifyMembership>,
) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseSendOtpVerifyMembership = yield call(
      sendOtpVerifyMembership,
      request,
    );
    onSuccess?.(response);
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

function* confirmMemberShipVerifyWorker(
  action: PayloadAction<IRequestConfirmMemberShipVerify>,
) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseConfirmMemberShipVerify = yield call(
      confirmMemberShipVerify,
      request,
    );
    onSuccess?.(response);
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

function* verifyUserNewLoginWorker(
  action: PayloadAction<IRequestVerifyUserNewLogin>,
) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseCreateLinkVerifyInfoUser = yield call(
      verifyUserNewLogin,
      request,
    );
    onSuccess?.(response);
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

function* selectSchoolWorker(action: PayloadAction<ISelectSchoolRequest>) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseLogin = yield call(selectSchool, request);
    yield put(authSuccess(response));
    yield put(selectSchoolSuccess({ universityId: request.universityId }));
    onSuccess?.();
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
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
  if (Globals.isOneSignalInitialized) {
    OneSignal.Notifications.clearAll();
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(loginSocialRequest.type, loginSocialWorker);
  yield takeLatest(registerUserRequest.type, registerUserWorker);
  yield takeLatest(
    createLinkVerifyUserRequest.type,
    createLinkVerifyUserWorker,
  );
  yield takeLatest(sendOTPRequest.type, sendOTPWorker);
  yield takeLatest(verifyOTPRequest.type, verifyOTPWorker);
  yield takeLatest(getUniversitiesRequest.type, getUniversitiesWorker);
  yield takeLatest(
    createLinkVerifyForgotPassRequest.type,
    createLinkVerifyForgotPassWorker,
  );
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
  yield takeLatest(verifyUserNewLoginRequest.type, verifyUserNewLoginWorker);
  yield takeLatest(logout.type, logoutWorker);
  yield takeLatest(refreshTokenRequest.type, refreshTokenWorker);
}
