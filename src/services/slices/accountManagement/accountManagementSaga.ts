import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IRequestAddAccount,
  IRequestGetAccountCards,
} from '@type/accountManagement';

import { call, put, takeLatest } from 'redux-saga/effects';
import {
  addAccountRequest,
  getAccountCardsRequest,
  getAccountCardsSuccess,
} from './accountManagementSlice';
import {
  addAccount,
  getAccountCards,
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

export function* accountManagementSaga() {
  yield takeLatest(addAccountRequest.type, addAccountWorker);
  yield takeLatest(getAccountCardsRequest.type, getAccountCardsWorker);
}
