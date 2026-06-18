import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  GetProductByIdPayload,
  GetProductsPayload,
} from '@type/products';

import { call, takeLatest } from 'redux-saga/effects';
import { getProductByIdRequest, getProductsRequest } from './productsSlice';
import { getProductById, getProducts } from '@services/request/products';

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

function* getProductByIdWorker(
  action: PayloadAction<GetProductByIdPayload>,
): Generator<unknown, void, void> {
  const { onSuccess, onFailure, productId } = action.payload;
  try {
    const response = yield call(getProductById, productId);
    onSuccess?.(response);
  } catch (error_) {
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
    onFailure?.(message);
  }
}

export function* productsSaga() {
  yield takeLatest(getProductsRequest.type, getProductsWorker);
  yield takeLatest(getProductByIdRequest.type, getProductByIdWorker);
}
