import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  StoreCartItem,
  CheckoutInfo,
  CreateOrderPayload,
  GetInfoProductCheckoutPayload,
  GetListCartPayload,
  GetOrderHistoriesPayload,
  OrderHistoryItem,
  RemoveCartItemPayload,
  UpdateCartItemPayload,
} from '@type/payment';
import type { ListApiResponse } from '@type/common';

import { call, takeLatest } from 'redux-saga/effects';
import dayjs from 'dayjs';

import {
  createOrder,
  getInfoProductCheckout,
  getListCart,
  removeCartItem,
  updateCartItem,
} from '@services/request/payment';
import { getErrorMessageApi } from '@utils/common';

import {
  createOrderRequest,
  getInfoProductCheckoutRequest,
  getListCartRequest,
  getOrderHistoriesRequest,
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
    yield call(updateCartItem, request);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* createOrderWorker(
  action: PayloadAction<CreateOrderPayload>,
): Generator<unknown, void, void> {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    const response = yield call(createOrder, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

const ORDER_HISTORIES_PAGE_SIZE = 10;

const ALL_MOCK_HISTORIES: OrderHistoryItem[] = [
  {
    actions: ['rate', 'reorder'],
    id: '1',
    imageUrl: '',
    points: 1335,
    price: 377_820,
    storeName: 'Phê La - Ung Văn Khiêm',
    time: dayjs('2026-06-25T13:58:00').toISOString(),
  },
  {
    actions: ['reorder'],
    id: '2',
    imageUrl: '',
    points: 9,
    price: 62_000,
    storeName: 'Gà Ta Thuỷ Trinh - Gà Luộc - Gà Cúng - Gà Xối Mỡ - Ngu...',
    time: dayjs('2026-05-28T10:55:00').toISOString(),
  },
  {
    actions: ['reorder'],
    id: '3',
    imageUrl: '',
    points: 9,
    price: 62_000,
    storeName: 'Gà Ta Thuỷ Trinh - Gà Luộc - Gà Cúng - Gà Xối Mỡ - Ngu...',
    time: dayjs('2026-05-25T10:40:00').toISOString(),
  },
  {
    actions: [],
    id: '4',
    imageUrl: '',
    points: 7,
    price: 47_000,
    storeName: 'BÁNH CANH CÁ LÓC CÔ THANH DĨ AN',
    time: dayjs('2026-05-22T18:56:00').toISOString(),
  },
  {
    actions: ['reorder'],
    id: '5',
    imageUrl: '',
    points: 10,
    price: 67_000,
    storeName: '3000 TEA - Tân Phước Khánh',
    time: dayjs('2026-04-23T10:21:00').toISOString(),
  },
  {
    actions: ['reorder'],
    id: '6',
    imageUrl: '',
    points: 8,
    price: 56_000,
    storeName: 'CHÚ BEN COFFEE - Matcha',
    time: dayjs('2026-04-10T09:15:00').toISOString(),
  },
  {
    actions: [],
    id: '7',
    imageUrl: '',
    points: 12,
    price: 85_000,
    storeName: 'Highlands Coffee - Aeon Mall Bình Dương',
    time: dayjs('2026-03-18T08:30:00').toISOString(),
  },
  {
    actions: ['reorder'],
    id: '8',
    imageUrl: '',
    points: 5,
    price: 35_000,
    storeName: 'Trà Sữa Chân Trâu - Thủ Dầu Một',
    time: dayjs('2026-03-05T15:10:00').toISOString(),
  },
];

function getMockOrderHistoriesPage(
  page: number,
  size: number,
): ListApiResponse<OrderHistoryItem[]> {
  const start = page * size;
  const content = ALL_MOCK_HISTORIES.slice(start, start + size);
  const totalElements = ALL_MOCK_HISTORIES.length;
  const totalPages = Math.ceil(totalElements / size);
  return {
    content,
    last: page >= totalPages - 1,
    page,
    size,
    totalElements,
    totalPages,
  };
}

function* getOrderHistoriesWorker(
  action: PayloadAction<GetOrderHistoriesPayload>,
): Generator<unknown, void, ListApiResponse<OrderHistoryItem[]>> {
  const { onFailure, onSuccess, page, size } = action.payload;
  try {
    // Replace with real API when ready:
    // const response: ListApiResponse<OrderHistoryItem[]> = yield call(getOrderHistories, { page, size });
    const response: ListApiResponse<OrderHistoryItem[]> = yield call(
      getMockOrderHistoriesPage,
      page,
      size ?? ORDER_HISTORIES_PAGE_SIZE,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

export function* paymentSaga() {
  yield takeLatest(createOrderRequest.type, createOrderWorker);
  yield takeLatest(
    getInfoProductCheckoutRequest.type,
    getInfoProductCheckoutWorker,
  );
  yield takeLatest(getListCartRequest.type, getListCartWorker);
  yield takeLatest(getOrderHistoriesRequest.type, getOrderHistoriesWorker);
  yield takeLatest(removeCartItemRequest.type, removeCartItemWorker);
  yield takeLatest(updateCartItemRequest.type, updateCartItemWorker);
}
