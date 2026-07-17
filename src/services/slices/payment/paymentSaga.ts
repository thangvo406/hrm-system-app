import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  StoreCartItem,
  CheckoutInfo,
  ContributeHistoryDetail,
  ContributeSummary,
  IRequestCreateOrder,
  CreateOrderResponse,
  IRequestGenerateQRCode,
  GenerateQRCodeResponse,
  IRequestGetCartDetail,
  IRequestGetContributeHistoryDetail,
  IRequestGetDividendDetail,
  IRequestGetHistoriesDividend,
  IRequestGetInfoProductCheckout,
  IRequestGetListCart,
  IRequestGetOrderHistories,
  IRequestGetOrderHistoryDetail,
  IRequestIncreaseContribute,
  IRequestInitCharge,
  OrderHistoryDetailItem,
  OrderHistoryItem,
  IRequestRemoveCartItem,
  IRequestUpdateCartItem,
  IResponseInitPayment,
  IKcpInitParams,
} from '@type/payment';
import type { AppCallback, ListApiResponse } from '@type/common';

import { call, takeLatest } from 'redux-saga/effects';

import {
  createLinkPaymentOrder,
  createOrder,
  generateQRCode,
  getAddressOrderRecent,
  getCartDetail,
  getContributeHistoryDetail,
  getContributeSummary,
  getDividendDetail,
  getHistoriesDividend,
  getInfoProductCheckout,
  getListCart,
  getOrderHistories,
  getOrderHistoryDetail,
  increaseContribution,
  balanceCharge,
  removeCartItem,
  updateCartItem,
} from '@services/request/payment';
import { getErrorMessageApi } from '@utils/common';

import {
  createOrderRequest,
  generateQRCodeRequest,
  getAddressOrderRecentRequest,
  getCartDetailRequest,
  getContributeHistoryDetailRequest,
  getContributeSummaryRequest,
  getDividendDetailRequest,
  getHistoriesDividendRequest,
  getInfoProductCheckoutRequest,
  getListCartRequest,
  getOrderHistoriesRequest,
  getOrderHistoryDetailRequest,
  increaseContributionRequest,
  balanceChargeRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from './paymentSlice';
import { IDividendHistory } from '@type';

function* getInfoProductCheckoutWorker(
  action: PayloadAction<IRequestGetInfoProductCheckout>,
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
  action: PayloadAction<IRequestGetListCart>,
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
  action: PayloadAction<IRequestRemoveCartItem>,
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
  action: PayloadAction<IRequestUpdateCartItem>,
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
  action: PayloadAction<IRequestCreateOrder>,
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
      const responsePayment: IResponseInitPayment = yield call(
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
      onFailure?.('payment', responseCreateOrder);
    }
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.('createOrder', message);
  }
}

function* getOrderHistoriesWorker(
  action: PayloadAction<IRequestGetOrderHistories>,
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

function* getCartDetailWorker(
  action: PayloadAction<IRequestGetCartDetail>,
): Generator<unknown, void, StoreCartItem> {
  const { onFailure, onSuccess, cartId } = action.payload;
  try {
    const response: StoreCartItem = yield call(getCartDetail, { cartId });
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getHistoriesDividendWorker(
  action: PayloadAction<IRequestGetHistoriesDividend>,
): Generator<unknown, void, ListApiResponse<IDividendHistory[]>> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: ListApiResponse<IDividendHistory[]> = yield call(
      getHistoriesDividend,
      request,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getOrderHistoryDetailWorker(
  action: PayloadAction<IRequestGetOrderHistoryDetail>,
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
  action: PayloadAction<AppCallback<string[]>>,
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
  action: PayloadAction<IRequestGenerateQRCode>,
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

function* balanceChargeWorker(
  action: PayloadAction<IRequestInitCharge>,
): Generator<unknown, void, IKcpInitParams> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IKcpInitParams = yield call(balanceCharge, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* increaseContributionWorker(
  action: PayloadAction<IRequestIncreaseContribute>,
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
  action: PayloadAction<AppCallback<ContributeSummary>>,
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
  action: PayloadAction<IRequestGetContributeHistoryDetail>,
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

function* getDividendDetailWorker(
  action: PayloadAction<IRequestGetDividendDetail>,
): Generator<unknown, void, ContributeHistoryDetail> {
  const { onFailure, onSuccess, dividendId } = action.payload;
  try {
    const response: ContributeHistoryDetail = yield call(getDividendDetail, {
      dividendId,
    });
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
  yield takeLatest(getDividendDetailRequest.type, getDividendDetailWorker);
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
  yield takeLatest(balanceChargeRequest.type, balanceChargeWorker);
  yield takeLatest(removeCartItemRequest.type, removeCartItemWorker);
  yield takeLatest(updateCartItemRequest.type, updateCartItemWorker);
  yield takeLatest(getCartDetailRequest.type, getCartDetailWorker);
  yield takeLatest(
    getHistoriesDividendRequest.type,
    getHistoriesDividendWorker,
  );
}
