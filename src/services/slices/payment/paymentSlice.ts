import type { AppCallback } from '@type/common';
import type {
  ICheckoutInfo,
  IRequestCreateOrder,
  IRequestGenerateQRCode,
  IRequestGetCartDetail,
  IRequestGetInfoProductCheckout,
  IRequestGetListCart,
  IRequestGetOrderHistories,
  IRequestGetOrderHistoryDetail,
  IRequestInitCharge,
  IRequestRemoveCartItem,
  IRequestUpdateCartItem,
} from '@type/payment';
import {
  IContributeSummary,
  IRequestGetContributeHistoryDetail,
  IRequestGetDividendDetail,
  IRequestGetHistoriesDividend,
  IRequestIncreaseContribute,
} from '@type/wallet';

import { createSlice } from '@reduxjs/toolkit';

export interface PaymentState {
  checkoutInfo: ICheckoutInfo | undefined;
}

const initialState: PaymentState = {
  checkoutInfo: undefined,
};

const paymentSlice = createSlice({
  initialState,
  name: 'payment',
  reducers: {
    createOrderRequest: {
      prepare: (payload: IRequestCreateOrder) => ({ payload }),
      reducer: () => {},
    },
    generateQRCodePayRequest: {
      prepare: (payload: IRequestGenerateQRCode) => ({ payload }),
      reducer: () => {},
    },
    balanceChargeRequest: {
      prepare: (payload: IRequestInitCharge) => ({ payload }),
      reducer: () => {},
    },
    getAddressOrderRecentRequest: {
      prepare: (payload: AppCallback<string[]> = {}) => ({ payload }),
      reducer: () => {},
    },
    getInfoProductCheckoutRequest: {
      prepare: (payload: IRequestGetInfoProductCheckout) => ({ payload }),
      reducer: () => {},
    },
    getListCartRequest: {
      prepare: (payload: IRequestGetListCart) => ({ payload }),
      reducer: () => {},
    },
    getOrderHistoriesRequest: {
      prepare: (payload: IRequestGetOrderHistories) => ({ payload }),
      reducer: () => {},
    },
    getOrderHistoryDetailRequest: {
      prepare: (payload: IRequestGetOrderHistoryDetail) => ({ payload }),
      reducer: () => {},
    },
    removeCartItemRequest: {
      prepare: (payload: IRequestRemoveCartItem) => ({ payload }),
      reducer: () => {},
    },
    updateCartItemRequest: {
      prepare: (payload: IRequestUpdateCartItem) => ({ payload }),
      reducer: () => {},
    },
    increaseContributionRequest: {
      prepare: (payload: IRequestIncreaseContribute) => ({ payload }),
      reducer: () => {},
    },
    getContributeSummaryRequest: {
      prepare: (payload: AppCallback<IContributeSummary>) => ({ payload }),
      reducer: () => {},
    },
    getContributeHistoryDetailRequest: {
      prepare: (payload: IRequestGetContributeHistoryDetail) => ({ payload }),
      reducer: () => {},
    },
    getCartDetailRequest: {
      prepare: (payload: IRequestGetCartDetail) => ({ payload }),
      reducer: () => {},
    },
    getHistoriesDividendRequest: {
      prepare: (payload: IRequestGetHistoriesDividend) => ({ payload }),
      reducer: () => {},
    },
    getDividendDetailRequest: {
      prepare: (payload: IRequestGetDividendDetail) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const {
  createOrderRequest,
  generateQRCodePayRequest,
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
} = paymentSlice.actions;
export const paymentReducer = paymentSlice.reducer;
