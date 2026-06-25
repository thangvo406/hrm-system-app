import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  StoreCartItem,
  CheckoutInfo,
  GetInfoProductCheckoutPayload,
  GetListCartPayload,
  GetTotalItemCartPayload,
  RemoveCartItemPayload,
  TotalItemCart,
  UpdateCartItemPayload,
} from '@type/payment';
import type { ListApiResponse } from '@type/common';

import { call, takeLatest } from 'redux-saga/effects';

import {
  getInfoProductCheckout,
  getListCart,
  getTotalItemCart,
  removeCartItem,
  updateCartItem,
} from '@services/request/payment';
import { getErrorMessageApi } from '@utils/common';

import {
  getInfoProductCheckoutRequest,
  getListCartRequest,
  getTotalItemCartRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from './paymentSlice';

function* getTotalItemCartWorker(
  action: PayloadAction<GetTotalItemCartPayload>,
): Generator<unknown, void, TotalItemCart> {
  const { onSuccess, onFailure } = action.payload || {};
  try {
    const response: TotalItemCart = yield call(getTotalItemCart);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

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

function* getListCartWorker(
  action: PayloadAction<GetListCartPayload>,
): Generator<unknown, void, ListApiResponse<StoreCartItem[]>> {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    const response: ListApiResponse<StoreCartItem[]> = yield call(
      getListCart,
      request,
    );
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

function* updateCartItemWorker(
  action: PayloadAction<UpdateCartItemPayload>,
): Generator<unknown, void, void> {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    yield call(updateCartItem, request);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

export function* paymentSaga() {
  yield takeLatest(getTotalItemCartRequest.type, getTotalItemCartWorker);
  yield takeLatest(
    getInfoProductCheckoutRequest.type,
    getInfoProductCheckoutWorker,
  );
  yield takeLatest(getListCartRequest.type, getListCartWorker);
  yield takeLatest(removeCartItemRequest.type, removeCartItemWorker);
  yield takeLatest(updateCartItemRequest.type, updateCartItemWorker);
}
