import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppCallback } from '@type/common';

import { call, put, select, takeLatest } from 'redux-saga/effects';

import { getProfile, type Profile } from '@services/request/account';
import { AccountSelector } from '@services/selectors';
import { refreshTokenRequest } from '@services/slices/auth/authSlice';

import { getProfileRequest, getProfileSuccess } from './accountSlice';

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

export function* accountSaga() {
  yield takeLatest(getProfileRequest.type, getProfileWorker);
}
