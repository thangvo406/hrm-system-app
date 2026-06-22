import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '@services/request/account';
import type {
  GetProfilePayload,
  UpdateMembershipPayload,
  UpdatePushIdPayload,
} from './accountSlice';

import {
  getProfile,
  updateMembership,
  updatePushId,
} from '@services/request/account';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
  getProfileRequest,
  updateMembershipRequest,
  updatePushIdRequest,
  getProfileSuccess,
} from './accountSlice';
import { AccountSelector } from '@services/selectors';
import { refreshTokenRequest } from '../auth/authSlice';

function* getProfileWorker(action: PayloadAction<GetProfilePayload>) {
  try {
    const oldProfile: Profile = yield select(AccountSelector.getProfile);
    const profile: Profile = yield call(getProfile);
    if (
      JSON.stringify(oldProfile.permissionCodes) !=
      JSON.stringify(profile.permissionCodes)
    ) {
      yield put(refreshTokenRequest());
    }
    yield put(getProfileSuccess(profile));
    action.payload.onSuccess?.(profile);
  } catch {
    action.payload.onFailure?.('');
  }
}

function* updatePushIdWorker(action: PayloadAction<UpdatePushIdPayload>) {
  try {
    yield call(updatePushId, action.payload);
    // yield put(updatePushIdSuccess());
    // action.payload.onSuccess?.();
  } catch {
    // action.payload.onFailure?.('');
  }
}

function* updateMembershipWorker(
  action: PayloadAction<UpdateMembershipPayload>,
) {
  const { onSuccess, onFailure, ...request } = action.payload;
  try {
    yield call(updateMembership, request);
    onSuccess?.();
  } catch (error_) {
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
    onFailure?.(message);
  }
}

export function* accountSaga() {
  yield takeLatest(getProfileRequest.type, getProfileWorker);
  yield takeLatest(updateMembershipRequest.type, updateMembershipWorker);
  yield takeLatest(updatePushIdRequest.type, updatePushIdWorker);
}
