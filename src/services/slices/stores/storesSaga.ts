import type { PayloadAction } from '@reduxjs/toolkit';
import type { ListApiResponse } from '@type/common';
import type {
  GetStoreDetailActionPayload,
  GetStoresActionPayload,
  StoreItem,
} from '@type/store';

import { call, takeLatest } from 'redux-saga/effects';

import { getStoreDetail, getStores } from '@services/request/stores';
import { getStoreDetailRequest, getStoresRequest } from './storesSlice';

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
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
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
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
    onFailure?.(message);
  }
}

export function* storesSaga() {
  yield takeLatest(getStoresRequest.type, getStoresWorker);
  yield takeLatest(getStoreDetailRequest.type, getStoreDetailWorker);
}
