import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  StoreCartItem,
  CheckoutInfo,
  CreateOrderPayload,
  CreateOrderResponse,
  GenerateQRCodePayload,
  GenerateQRCodeResponse,
  GetAddressOrderRecentPayload,
  GetInfoProductCheckoutPayload,
  GetListCartPayload,
  GetOrderHistoriesPayload,
  GetOrderHistoryDetailPayload,
  OrderHistoryDetailItem,
  OrderHistoryItem,
  RemoveCartItemPayload,
  UpdateCartItemPayload,
} from '@type/payment';
import type { ListApiResponse } from '@type/common';

import { call, takeLatest } from 'redux-saga/effects';

import {
  createOrder,
  generateQRCode,
  getAddressOrderRecent,
  getInfoProductCheckout,
  getListCart,
  getOrderHistories,
  getOrderHistoryDetail,
  removeCartItem,
  updateCartItem,
} from '@services/request/payment';
import { getErrorMessageApi } from '@utils/common';

import {
  createOrderRequest,
  generateQRCodeRequest,
  getAddressOrderRecentRequest,
  getInfoProductCheckoutRequest,
  getListCartRequest,
  getOrderHistoriesRequest,
  getOrderHistoryDetailRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from './paymentSlice';

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
    const response = yield call(updateCartItem, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* createOrderWorker(
  action: PayloadAction<CreateOrderPayload>,
): Generator<unknown, void, CreateOrderResponse> {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    const response: CreateOrderResponse = yield call(createOrder, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getOrderHistoriesWorker(
  action: PayloadAction<GetOrderHistoriesPayload>,
): Generator<unknown, void, ListApiResponse<OrderHistoryItem[]>> {
  const { onFailure, onSuccess, page, size } = action.payload;
  try {
    const response: ListApiResponse<OrderHistoryItem[]> = yield call(
      getOrderHistories,
      { page, size },
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getOrderHistoryDetailWorker(
  action: PayloadAction<GetOrderHistoryDetailPayload>,
): Generator<unknown, void, OrderHistoryDetailItem> {
  const { onFailure, onSuccess, orderId } = action.payload;
  try {
    const response: OrderHistoryDetailItem = yield call(getOrderHistoryDetail, {
      orderId,
    });
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getAddressOrderRecentWorker(
  action: PayloadAction<GetAddressOrderRecentPayload>,
): Generator<unknown, void, string[]> {
  const { onFailure, onSuccess } = action.payload;
  try {
    const data: string[] = yield call(getAddressOrderRecent);
    onSuccess?.(data);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* generateQRCodeWorker(
  action: PayloadAction<GenerateQRCodePayload>,
): Generator<unknown, void, GenerateQRCodeResponse> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: GenerateQRCodeResponse = yield call(generateQRCode, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

export function* paymentSaga() {
  yield takeLatest(createOrderRequest.type, createOrderWorker);
  yield takeLatest(generateQRCodeRequest.type, generateQRCodeWorker);
  yield takeLatest(getAddressOrderRecentRequest.type, getAddressOrderRecentWorker);
  yield takeLatest(
    getInfoProductCheckoutRequest.type,
    getInfoProductCheckoutWorker,
  );
  yield takeLatest(getListCartRequest.type, getListCartWorker);
  yield takeLatest(getOrderHistoriesRequest.type, getOrderHistoriesWorker);
  yield takeLatest(
    getOrderHistoryDetailRequest.type,
    getOrderHistoryDetailWorker,
  );
  yield takeLatest(removeCartItemRequest.type, removeCartItemWorker);
  yield takeLatest(updateCartItemRequest.type, updateCartItemWorker);
}
