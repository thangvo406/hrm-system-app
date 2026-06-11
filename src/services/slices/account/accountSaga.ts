import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '@services/request/account';
import type { GetProfilePayload } from './accountSlice';

import { getProfile } from '@services/request/account';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getProfileRequest, getProfileSuccess } from './accountSlice';

function* getProfileWorker(action: PayloadAction<GetProfilePayload>) {
  try {
    const profile: Profile = yield call(getProfile);
    yield put(getProfileSuccess(profile));
    action.payload.onSuccess?.(profile);
  } catch {
    action.payload.onFailure?.('');
  }
}

export function* accountSaga() {
  yield takeLatest(getProfileRequest.type, getProfileWorker);
}
