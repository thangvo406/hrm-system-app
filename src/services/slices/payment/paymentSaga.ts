import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  CheckoutInfo,
  GetInfoProductCheckoutPayload,
} from '@type/payment';

import { call, put, takeLatest } from 'redux-saga/effects';

import { getInfoProductCheckout } from '@services/request/payment';
import { getErrorMessageApi } from '@utils/common';

import { getInfoProductCheckoutRequest } from './paymentSlice';

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

export function* paymentSaga() {
  yield takeLatest(
    getInfoProductCheckoutRequest.type,
    getInfoProductCheckoutWorker,
  );
}
