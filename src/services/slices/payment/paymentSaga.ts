import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IStoreCartItem,
  ICheckoutInfo,
  IRequestCancelOrder,
  IRequestCreateOrder,
  ICreateOrderResponse,
  IRequestDecreaseContribute,
  IRequestGenerateQRCode,
  IRequestGetCartDetail,
  IRequestGetInfoProductCheckout,
  IRequestGetListCart,
  IRequestGetOrderHistories,
  IRequestGetOrderHistoryDetail,
  IRequestInitCharge,
  IOrderHistoryDetailItem,
  IOrderHistoryItem,
  IPriceDetail,
  IRequestCalculatePrice,
  IRequestRemoveCartItem,
  IRequestUpdateCartItem,
  IResponseInitPayment,
  IKcpInitParams,
  IRequestGenerateQRRefundTransaction,
  IRequestReOrder,
} from '@type/payment';
import { IGenerateQRCodeResponse } from '@type/account';

import {
  IRequestIncreaseContribute,
  IContributeHistoryDetail,
  IContributeSummary,
  IRequestGetContributeHistoryDetail,
  IRequestGetDividendDetail,
  IRequestGetHistoriesDividend,
} from '@type/wallet';
import type { AppCallback, ListApiResponse } from '@type/common';

import { call, put, takeLatest } from 'redux-saga/effects';

import {
  calculatePrice,
  cancelOrder,
  createLinkPaymentOrder,
  createOrder,
  decreaseContribute,
  generateQRCodePay,
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
  reorder,
  removeCartItem,
  updateCartItem,
  generateQRRefundTransaction,
} from '@services/request/payment';
import { getErrorMessageApi } from '@utils/common';

import {
  calculatePriceRequest,
  cancelOrderRequest,
  createOrderRequest,
  decreaseContributeRequest,
  generateQRCodePayRequest,
  getAddressOrderRecentRequest,
  getCartDetailRequest,
  getContributeHistoryDetailRequest,
  getContributeSummaryRequest,
  getContributeSummarySuccess,
  getDividendDetailRequest,
  getHistoriesDividendRequest,
  getInfoProductCheckoutRequest,
  getListCartRequest,
  getOrderHistoriesRequest,
  getOrderHistoryDetailRequest,
  increaseContributionRequest,
  balanceChargeRequest,
  reorderRequest,
  removeCartItemRequest,
  updateCartItemRequest,
  generateQRRefundTransactionRequest,
} from './paymentSlice';
import { IDividendHistory } from '@type';

function* getInfoProductCheckoutWorker(
  action: PayloadAction<IRequestGetInfoProductCheckout>,
): Generator<unknown, void, ICheckoutInfo> {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    const response: ICheckoutInfo = yield call(getInfoProductCheckout, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getListCartWorker(
  action: PayloadAction<IRequestGetListCart>,
): Generator<unknown, void, ListApiResponse<IStoreCartItem[]>> {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    const response: ListApiResponse<IStoreCartItem[]> = yield call(
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
): Generator<unknown, void, IStoreCartItem> {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    const response: IStoreCartItem = yield call(updateCartItem, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* createOrderWorker(
  action: PayloadAction<IRequestCreateOrder>,
): Generator<unknown, void, unknown> {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    const { createLinkRequest, ...orderRequest } = request;
    const responseCreateOrder = (yield call(
      createOrder,
      orderRequest as Parameters<typeof createOrder>[0],
    )) as ICreateOrderResponse;
    try {
      const responsePayment = (yield call(createLinkPaymentOrder, {
        ...createLinkRequest,
        orderId: responseCreateOrder.id,
      })) as IResponseInitPayment;
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
): Generator<unknown, void, ListApiResponse<IOrderHistoryItem[]>> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: ListApiResponse<IOrderHistoryItem[]> = yield call(
      getOrderHistories,
      request,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getCartDetailWorker(
  action: PayloadAction<IRequestGetCartDetail>,
): Generator<unknown, void, IStoreCartItem> {
  const { onFailure, onSuccess, cartId } = action.payload;
  try {
    const response: IStoreCartItem = yield call(getCartDetail, { cartId });
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
): Generator<unknown, void, IOrderHistoryDetailItem> {
  const { onFailure, onSuccess, orderId } = action.payload;
  try {
    const response: IOrderHistoryDetailItem = yield call(
      getOrderHistoryDetail,
      {
        orderId,
      },
    );
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
): Generator<unknown, void, IGenerateQRCodeResponse> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IGenerateQRCodeResponse = yield call(
      generateQRCodePay,
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

function* reorderWorker(
  action: PayloadAction<IRequestReOrder>,
): Generator<unknown, void, IStoreCartItem> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IStoreCartItem = yield call(reorder, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* cancelOrderWorker(
  action: PayloadAction<IRequestCancelOrder>,
): Generator<unknown, void, void> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    yield call(cancelOrder, request);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* calculatePriceWorker(
  action: PayloadAction<IRequestCalculatePrice>,
): Generator<unknown, void, IPriceDetail> {
  const { onFailure, onSuccess, ...request } = action.payload || {};
  try {
    const response: IPriceDetail = yield call(calculatePrice, request);
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
    const response = yield call(increaseContribution, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* decreaseContributeWorker(
  action: PayloadAction<IRequestDecreaseContribute>,
): Generator<unknown, void, IKcpInitParams> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IKcpInitParams = yield call(decreaseContribute, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getContributeSummaryWorker(
  action: PayloadAction<AppCallback<IContributeSummary>>,
): Generator<unknown, void, IContributeSummary> {
  const { onFailure, onSuccess } = action.payload;
  try {
    const response: IContributeSummary = yield call(getContributeSummary);
    yield put(getContributeSummarySuccess(response));
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* generateQRRefundTransactionWorker(
  action: PayloadAction<IRequestGenerateQRRefundTransaction>,
): Generator<unknown, void, IGenerateQRCodeResponse> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IGenerateQRCodeResponse = yield call(
      generateQRRefundTransaction,
      request,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getContributeHistoryDetailWorker(
  action: PayloadAction<IRequestGetContributeHistoryDetail>,
): Generator<unknown, void, IContributeHistoryDetail> {
  const { onFailure, onSuccess, historyId } = action.payload;
  try {
    const response: IContributeHistoryDetail = yield call(
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
): Generator<unknown, void, IContributeHistoryDetail> {
  const { onFailure, onSuccess, dividendId } = action.payload;
  try {
    const response: IContributeHistoryDetail = yield call(getDividendDetail, {
      dividendId,
    });
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

export function* paymentSaga() {
  yield takeLatest(calculatePriceRequest.type, calculatePriceWorker);
  yield takeLatest(cancelOrderRequest.type, cancelOrderWorker);
  yield takeLatest(createOrderRequest.type, createOrderWorker);
  yield takeLatest(generateQRCodePayRequest.type, generateQRCodeWorker);
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
  yield takeLatest(decreaseContributeRequest.type, decreaseContributeWorker);
  yield takeLatest(balanceChargeRequest.type, balanceChargeWorker);
  yield takeLatest(reorderRequest.type, reorderWorker);
  yield takeLatest(removeCartItemRequest.type, removeCartItemWorker);
  yield takeLatest(
    generateQRRefundTransactionRequest.type,
    generateQRRefundTransactionWorker,
  );
  yield takeLatest(updateCartItemRequest.type, updateCartItemWorker);
  yield takeLatest(getCartDetailRequest.type, getCartDetailWorker);
  yield takeLatest(
    getHistoriesDividendRequest.type,
    getHistoriesDividendWorker,
  );
}
