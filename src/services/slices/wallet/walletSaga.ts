import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  GetCurrentWalletPayload,
  GetTransactionHistoriesPayload,
  TopUpWalletPayload,
  Wallet,
} from '@type/wallet';

import { call, put, takeLatest } from 'redux-saga/effects';

import {
  getCurrentWallet,
  getTransactionHistories,
  topUpWallet,
} from '@services/request/wallet';
import { getErrorMessageApi } from '@utils/common';

import {
  getCurrentWalletRequest,
  getCurrentWalletSuccess,
  getTransactionHistoriesRequest,
  topUpWalletRequest,
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

function* getTransactionHistoriesWorker(
  action: PayloadAction<GetTransactionHistoriesPayload>,
): Generator<unknown, void, Wallet> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const data: Wallet = yield call(getTransactionHistories, request);
    onSuccess?.(data);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* topUpWalletWorker(
  action: PayloadAction<TopUpWalletPayload>,
): Generator<unknown, void, Wallet> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const data: Wallet = yield call(topUpWallet, request);
    onSuccess?.(data);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

export function* walletSaga() {
  yield takeLatest(getCurrentWalletRequest.type, getCurrentWalletWorker);
  yield takeLatest(
    getTransactionHistoriesRequest.type,
    getTransactionHistoriesWorker,
  );
  yield takeLatest(topUpWalletRequest.type, topUpWalletWorker);
}
