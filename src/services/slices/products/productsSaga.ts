import type { PayloadAction } from '@reduxjs/toolkit';
import type { GetProductsPayload } from '@type/products';

import { call, takeLatest } from 'redux-saga/effects';
import { getProductsRequest } from './productsSlice';
import { getProducts } from '@services/request/products';

function* getProductsWorker(
  action: PayloadAction<GetProductsPayload>,
): Generator<unknown, void, void> {
  const { onSuccess, onFailure, ...request } = action.payload;
  try {
    const response = yield call(getProducts, request);
    // yield delay(MOCK_DELAY_MS);
    console.log('items', response);
    onSuccess?.(response);
  } catch (error_) {
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
    onFailure?.(message);
  }
}

export function* productsSaga() {
  yield takeLatest(getProductsRequest.type, getProductsWorker);
}
