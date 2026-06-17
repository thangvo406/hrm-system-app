import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '@services/request/account';
import type { GetProfilePayload, UpdatePushIdPayload } from './accountSlice';

import { getProfile, updatePushId } from '@services/request/account';
import { call, put, takeLatest } from 'redux-saga/effects';

import {
  getProfileRequest,
  updatePushIdRequest,
  getProfileSuccess,
} from './accountSlice';

function* getProfileWorker(action: PayloadAction<GetProfilePayload>) {
  try {
    const profile: Profile = yield call(getProfile);
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

export function* accountSaga() {
  yield takeLatest(getProfileRequest.type, getProfileWorker);
  yield takeLatest(updatePushIdRequest.type, updatePushIdWorker);
}
