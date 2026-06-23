import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '@services/request/account';
import type {
  GetProfilePayload,
  UpdateMembershipPayload,
  UpdatePushIdPayload,
} from './accountSlice';
import type {
  GetCurrentWalletPayload,
  GetTransactionHistoriesPayload,
  TopUpWalletPayload,
  Wallet,
} from '@type/wallet';
import type { ListApiResponse } from '@type/common';
import type { TransactionHistory } from '@type/wallet';

import {
  getProfile,
  updateMembership,
  updatePushId,
} from '@services/request/account';
import {
  getCurrentWallet,
  getTransactionHistories,
  topUpWallet,
} from '@services/request/wallet';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { getErrorMessageApi } from '@utils/common';

import {
  getCurrentWalletRequest,
  getCurrentWalletSuccess,
  getProfileRequest,
  getProfileSuccess,
  getTransactionHistoriesRequest,
  topUpWalletRequest,
  updateMembershipRequest,
  updatePushIdRequest,
} from './accountSlice';
import { AccountSelector } from '@services/selectors';
import { refreshTokenRequest } from '../auth/authSlice';

function* getProfileWorker(action: PayloadAction<GetProfilePayload>) {
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

function* updatePushIdWorker(action: PayloadAction<UpdatePushIdPayload>) {
  try {
    yield call(updatePushId, action.payload);
  } catch {
    // silent
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

function* getCurrentWalletWorker(
  action: PayloadAction<GetCurrentWalletPayload>,
): Generator<unknown, void, Wallet> {
  const { onSuccess, onFailure } = action.payload || {};
  try {
    const wallet: Wallet = yield call(getCurrentWallet);
    yield put(getCurrentWalletSuccess(wallet));
    onSuccess?.(wallet);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getTransactionHistoriesWorker(
  action: PayloadAction<GetTransactionHistoriesPayload>,
): Generator<unknown, void, ListApiResponse<TransactionHistory[]>> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const data: ListApiResponse<TransactionHistory[]> = yield call(
      getTransactionHistories,
      request,
    );
    onSuccess?.(data);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* topUpWalletWorker(
  action: PayloadAction<TopUpWalletPayload>,
): Generator<unknown, void, ListApiResponse<TransactionHistory[]>> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const data: ListApiResponse<TransactionHistory[]> = yield call(
      topUpWallet,
      request,
    );
    onSuccess?.(data);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

export function* accountSaga() {
  yield takeLatest(getProfileRequest.type, getProfileWorker);
  yield takeLatest(updateMembershipRequest.type, updateMembershipWorker);
  yield takeLatest(updatePushIdRequest.type, updatePushIdWorker);
  yield takeLatest(getCurrentWalletRequest.type, getCurrentWalletWorker);
  yield takeLatest(
    getTransactionHistoriesRequest.type,
    getTransactionHistoriesWorker,
  );
  yield takeLatest(topUpWalletRequest.type, topUpWalletWorker);
}
