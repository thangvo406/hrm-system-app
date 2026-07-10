import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  StoreCartItem,
  CheckoutInfo,
  ContributeHistoryDetail,
  ContributeSummary,
  CreateOrderPayload,
  CreateOrderResponse,
  GenerateQRCodePayload,
  GenerateQRCodeResponse,
  GetAddressOrderRecentPayload,
  GetContributeHistoryDetailPayload,
  GetContributeSummaryPayload,
  GetInfoProductCheckoutPayload,
  GetListCartPayload,
  GetOrderHistoriesPayload,
  GetOrderHistoryDetailPayload,
  InitChargePayload,
  InitChargeResponse,
  OrderHistoryDetailItem,
  OrderHistoryItem,
  RemoveCartItemPayload,
  UpdateCartItemPayload,
  IResponseCreateLinkPaymentOrder,
} from '@type/payment';
import type { ListApiResponse } from '@type/common';

import { call, takeLatest } from 'redux-saga/effects';

import {
  createLinkPaymentOrder,
  createOrder,
  generateQRCode,
  getAddressOrderRecent,
  getContributeHistoryDetail,
  getContributeSummary,
  getInfoProductCheckout,
  getListCart,
  getOrderHistories,
  getOrderHistoryDetail,
  increaseContribution,
  initCharge,
  removeCartItem,
  updateCartItem,
} from '@services/request/payment';
import { getErrorMessageApi } from '@utils/common';

import {
  createOrderRequest,
  generateQRCodeRequest,
  getAddressOrderRecentRequest,
  getContributeHistoryDetailRequest,
  getContributeSummaryRequest,
  getInfoProductCheckoutRequest,
  getListCartRequest,
  getOrderHistoriesRequest,
  getOrderHistoryDetailRequest,
  increaseContributionRequest,
  initChargeRequest,
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
    const createLinkRequest = request.createLinkRequest;
    delete request.createLinkRequest;
    const responseCreateOrder: CreateOrderResponse = yield call(
      createOrder,
      request,
    );
    try {
      const responsePayment: IResponseCreateLinkPaymentOrder = yield call(
        createLinkPaymentOrder,
        {
          orderId: responseCreateOrder.id,
          payment: createLinkRequest,
        },
      );
      onSuccess?.({
        responseCreateOrder,
        responsePayment,
      });
    } catch {
      onFailure?.('payment', '');
    }
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.('createOrder', message);
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
    const response: GenerateQRCodeResponse = yield call(
      generateQRCode,
      request,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* initChargeWorker(
  action: PayloadAction<InitChargePayload>,
): Generator<unknown, void, InitChargeResponse> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: InitChargeResponse = yield call(initCharge, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* increaseContributionWorker(
  action: PayloadAction<import('@type/payment').IncreaseContributePayload>,
): Generator<unknown, void, void> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    yield call(increaseContribution, request);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getContributeSummaryWorker(
  action: PayloadAction<GetContributeSummaryPayload>,
): Generator<unknown, void, ContributeSummary> {
  const { onFailure, onSuccess } = action.payload;
  try {
    const response: ContributeSummary = yield call(getContributeSummary);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getContributeHistoryDetailWorker(
  action: PayloadAction<GetContributeHistoryDetailPayload>,
): Generator<unknown, void, ContributeHistoryDetail> {
  const { onFailure, onSuccess, historyId } = action.payload;
  try {
    const response: ContributeHistoryDetail = yield call(
      getContributeHistoryDetail,
      { historyId },
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

export function* paymentSaga() {
  yield takeLatest(createOrderRequest.type, createOrderWorker);
  yield takeLatest(generateQRCodeRequest.type, generateQRCodeWorker);
  yield takeLatest(
    getAddressOrderRecentRequest.type,
    getAddressOrderRecentWorker,
  );
  yield takeLatest(
    getContributeSummaryRequest.type,
    getContributeSummaryWorker,
  );
  yield takeLatest(
    getContributeHistoryDetailRequest.type,
    getContributeHistoryDetailWorker,
  );
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
  yield takeLatest(
    increaseContributionRequest.type,
    increaseContributionWorker,
  );
  yield takeLatest(initChargeRequest.type, initChargeWorker);
  yield takeLatest(removeCartItemRequest.type, removeCartItemWorker);
  yield takeLatest(updateCartItemRequest.type, updateCartItemWorker);
}
