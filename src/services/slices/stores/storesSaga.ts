import type { PayloadAction } from '@reduxjs/toolkit';
import type { ListApiResponse } from '@type/common';
import type {
  GetStoreDetailPayload,
  GetStoresPayload,
  StoreItem,
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
  action: PayloadAction<GetStoresPayload>,
): Generator<unknown, void, ListApiResponse<StoreItem[]>> {
  const { onFailure, onSuccess, ...request } = action.payload || {};
  try {
    const response: ListApiResponse<StoreItem[]> = yield call(
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
  action: PayloadAction<GetStoreDetailPayload>,
): Generator<unknown, void, StoreItem> {
  const { onFailure, onSuccess, storeId } = action.payload;
  try {
    const response: StoreItem = yield call(getStoreDetail, storeId);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getStoreOrderRecentWorker(): Generator<unknown, void, StoreItem[]> {
  try {
    const response: StoreItem = yield call(getStoreOrderRecent);
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
