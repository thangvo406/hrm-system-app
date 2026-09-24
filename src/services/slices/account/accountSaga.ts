import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppCallback } from '@type/common';

import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
  getListOffice,
  getProfile,
  type Profile,
} from '@services/request/account';
import { AccountSelector } from '@services/selectors';
import { refreshTokenRequest } from '@services/slices/auth/authSlice';

import {
  getListOfficeRequest,
  getProfileRequest,
  getProfileSuccess,
  getListOfficeSuccess,
} from './accountSlice';
import { IOffice, IRequestGetListOffice } from '@type';

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

function* getListOfficeWorker() {
  // const { ...request } = action.payload;
  try {
    const response: IOffice[] = yield call(getListOffice);
    yield put(getListOfficeSuccess(response));
  } catch {
    // onFailure?.(getErrorMessageApi(error));
  }
}

export function* accountSaga() {
  yield takeLatest(getProfileRequest.type, getProfileWorker);
  yield takeLatest(getListOfficeRequest.type, getListOfficeWorker);
}
