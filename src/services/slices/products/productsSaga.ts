import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IProduct,
  IRequestCheckoutProduct,
  IRequestGetProductById,
  IRequestGetProducts,
  IResponseProductDetail,
} from '@type/products';

import { call, takeLatest } from 'redux-saga/effects';
import {
  checkoutProductRequest,
  getProductByIdRequest,
  getProductsRequest,
} from './productsSlice';
import {
  checkoutProduct,
  getProductById,
  getProducts,
} from '@services/request/products';
import { getErrorMessageApi } from '@utils/common';
import { IStoreCartItem, ListApiResponse } from '@type';

function* getProductsWorker(
  action: PayloadAction<IRequestGetProducts>,
): Generator<unknown, void, ListApiResponse<IProduct[]>> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response = yield call(getProducts, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getProductByIdWorker(
  action: PayloadAction<IRequestGetProductById>,
): Generator<unknown, void, IResponseProductDetail> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response = yield call(getProductById, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* checkoutProductWorker(
  action: PayloadAction<IRequestCheckoutProduct>,
): Generator<unknown, void, IStoreCartItem> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response = yield call(checkoutProduct, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

export function* productsSaga() {
  yield takeLatest(getProductsRequest.type, getProductsWorker);
  yield takeLatest(checkoutProductRequest.type, checkoutProductWorker);
  yield takeLatest(getProductByIdRequest.type, getProductByIdWorker);
}
