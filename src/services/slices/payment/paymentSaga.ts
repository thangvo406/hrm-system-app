import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  CheckoutInfo,
  GetInfoProductCheckoutPayload,
  RemoveCartItemPayload,
} from '@type/payment';

import { call, takeLatest } from 'redux-saga/effects';

import { getInfoProductCheckout, removeCartItem } from '@services/request/payment';
import { getErrorMessageApi } from '@utils/common';

import { getInfoProductCheckoutRequest, removeCartItemRequest } from './paymentSlice';

function* getInfoProductCheckoutWorker(
  action: PayloadAction<GetInfoProductCheckoutPayload>,
): Generator<unknown, void, CheckoutInfo> {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    const response: CheckoutInfo = yield call(getInfoProductCheckout, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* removeCartItemWorker(
  action: PayloadAction<RemoveCartItemPayload>,
): Generator<unknown, void, void> {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    yield call(removeCartItem, request);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

export function* paymentSaga() {
  yield takeLatest(
    getInfoProductCheckoutRequest.type,
    getInfoProductCheckoutWorker,
  );
  yield takeLatest(removeCartItemRequest.type, removeCartItemWorker);
}
