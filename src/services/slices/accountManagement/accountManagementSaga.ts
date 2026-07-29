import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IRequestAddAccount,
  IRequestGetAccountCards,
} from '@type/accountManagement';
import type { IRequestLockCard, IRequestRemoveCard } from '@type/wallet';

import { call, put, takeLatest } from 'redux-saga/effects';
import {
  addAccountRequest,
  getAccountCardsRequest,
  getAccountCardsSuccess,
  lockCardAccountRequest,
  removeCardAccountRequest,
} from './accountManagementSlice';
import {
  addAccount,
  getAccountCards,
  lockCardAccount,
  removeCardAccount,
} from '@services/request/accountManagement';
import { getErrorMessageApi } from '@utils/common';
import { IAccount, IKcpInitParams } from '@type';

function* addAccountWorker(
  action: PayloadAction<IRequestAddAccount>,
): Generator<unknown, void, IKcpInitParams> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response = yield call(addAccount, request);
    onSuccess?.(response);
  } catch (error_) {
    onFailure?.(getErrorMessageApi(error_));
  }
}

function* getAccountCardsWorker(
  action: PayloadAction<IRequestGetAccountCards>,
): Generator<unknown, void, IAccount[]> {
  const { onFailure, onSuccess } = action.payload;
  try {
    const response = yield call(getAccountCards);
    yield put(getAccountCardsSuccess(response));
    onSuccess?.(response);
  } catch (error_) {
    onFailure?.(getErrorMessageApi(error_));
  }
}

function* lockCardAccountWorker(
  action: PayloadAction<IRequestLockCard>,
): Generator<unknown, void, boolean> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    yield call(lockCardAccount, request);
    // The lock flag lives on the payment method, so refresh the cached list.
    yield put(getAccountCardsRequest({}));
    onSuccess?.();
  } catch (error_) {
    onFailure?.(getErrorMessageApi(error_));
  }
}

function* removeCardAccountWorker(
  action: PayloadAction<IRequestRemoveCard>,
): Generator<unknown, void, boolean> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    yield call(removeCardAccount, request);
    yield put(getAccountCardsRequest({}));
    onSuccess?.();
  } catch (error_) {
    onFailure?.(getErrorMessageApi(error_));
  }
}

export function* accountManagementSaga() {
  yield takeLatest(addAccountRequest.type, addAccountWorker);
  yield takeLatest(getAccountCardsRequest.type, getAccountCardsWorker);
  yield takeLatest(lockCardAccountRequest.type, lockCardAccountWorker);
  yield takeLatest(removeCardAccountRequest.type, removeCardAccountWorker);
}
