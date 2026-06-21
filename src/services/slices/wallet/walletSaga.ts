import type { PayloadAction } from '@reduxjs/toolkit';
import type { GetCurrentWalletPayload, Wallet } from '@type/wallet';

import { call, put, takeLatest } from 'redux-saga/effects';

import { getCurrentWallet } from '@services/request/wallet';
import { getErrorMessageApi } from '@utils/common';

import {
  getCurrentWalletRequest,
  getCurrentWalletSuccess,
} from './walletSlice';

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

export function* walletSaga() {
  yield takeLatest(getCurrentWalletRequest.type, getCurrentWalletWorker);
}
