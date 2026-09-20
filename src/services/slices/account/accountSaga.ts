import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppCallback } from '@type/common';
import type { IRequestUpdatePushIdCallback } from '@type/account';

import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
  getProfile,
  updatePushId,
  type Profile,
} from '@services/request/account';
import { AccountSelector } from '@services/selectors';
import { refreshTokenRequest } from '@services/slices/auth/authSlice';
import { getErrorMessageApi } from '@utils/common';

import {
  getProfileRequest,
  getProfileSuccess,
  updatePushIdRequest,
} from './accountSlice';

function* getProfileWorker(action: PayloadAction<AppCallback<Profile>>) {
  try {
    const oldProfile: Profile = yield select(AccountSelector.getProfile);
    const profile: Profile = yield call(getProfile);
    if (
      oldProfile &&
      JSON.stringify(oldProfile.permissionCodes) !=
        JSON.stringify(profile?.permissionCodes)
    ) {
      yield put(refreshTokenRequest());
    }
    yield put(getProfileSuccess(profile));
    action.payload.onSuccess?.(profile);
  } catch {
    action.payload.onFailure?.('');
  }
}

function* updatePushIdWorker(
  action: PayloadAction<IRequestUpdatePushIdCallback>,
) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    yield call(updatePushId, request);
    onSuccess?.();
  } catch (error_) {
    onFailure?.(getErrorMessageApi(error_));
  }
}

export function* accountSaga() {
  yield takeLatest(getProfileRequest.type, getProfileWorker);
  yield takeLatest(updatePushIdRequest.type, updatePushIdWorker);
}
