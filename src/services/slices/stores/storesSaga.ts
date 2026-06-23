import type { PayloadAction } from '@reduxjs/toolkit';
import type { ListApiResponse } from '@type/common';
import type {
  GetStoreDetailActionPayload,
  GetStoreOrderRecentActionPayload,
  GetStoresActionPayload,
  StoreItem,
} from '@type/store';

import { call, takeLatest } from 'redux-saga/effects';

import {
  getStoreDetail,
  getStoreOrderRecent,
  getStores,
} from '@services/request/stores';
import {
  getStoreDetailRequest,
  getStoreOrderRecentRequest,
  getStoresRequest,
} from './storesSlice';
import { getErrorMessageApi } from '@utils/common';

function* getStoresWorker(
  action: PayloadAction<GetStoresActionPayload>,
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
  action: PayloadAction<GetStoreDetailActionPayload>,
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

function* getStoreOrderRecentWorker(
  action: PayloadAction<GetStoreOrderRecentActionPayload>,
): Generator<unknown, void, StoreItem[]> {
  const { onFailure, onSuccess } = action.payload || {};
  try {
    const response: StoreItem[] = yield call(getStoreOrderRecent);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

export function* storesSaga() {
  yield takeLatest(getStoresRequest.type, getStoresWorker);
  yield takeLatest(getStoreDetailRequest.type, getStoreDetailWorker);
  yield takeLatest(getStoreOrderRecentRequest.type, getStoreOrderRecentWorker);
}
