import type { PayloadAction } from '@reduxjs/toolkit';
import type { ListApiResponse } from '@type/common';
import type {
  IRequestGetStoreDetail,
  IRequestGetStores,
  IStoreItem,
} from '@type/store';

import { call, put, takeLatest } from 'redux-saga/effects';

import {
  getStoreDetail,
  getStoreOrderRecent,
  getStores,
} from '@services/request/stores';
import {
  getStoreDetailRequest,
  getStoreOrderRecentRequest,
  getStoresRequest,
  setStoreOrderRecent,
} from './storesSlice';
import { getErrorMessageApi } from '@utils/common';

function* getStoresWorker(
  action: PayloadAction<IRequestGetStores>,
): Generator<unknown, void, ListApiResponse<IStoreItem[]>> {
  const { onFailure, onSuccess, ...request } = action.payload || {};
  try {
    const response: ListApiResponse<IStoreItem[]> = yield call(
      getStores,
      request,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getStoreDetailWorker(
  action: PayloadAction<IRequestGetStoreDetail>,
): Generator<unknown, void, IStoreItem> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IStoreItem = yield call(getStoreDetail, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getStoreOrderRecentWorker(): Generator<unknown, void, IStoreItem[]> {
  try {
    const response: IStoreItem = yield call(getStoreOrderRecent);
    yield put(setStoreOrderRecent(response));
  } catch {
    //TODO: //handle error
  }
}

export function* storesSaga() {
  yield takeLatest(getStoresRequest.type, getStoresWorker);
  yield takeLatest(getStoreDetailRequest.type, getStoreDetailWorker);
  yield takeLatest(getStoreOrderRecentRequest.type, getStoreOrderRecentWorker);
}
