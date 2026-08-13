import type { AppCallback } from '@type/common';
import type {
  ICheckoutInfo,
  IRequestCalculatePrice,
  IRequestCreateOrder,
  IRequestDecreaseContribute,
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

import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

export interface PaymentState {
  contributeSummary: IContributeSummary | undefined;
}

const initialState: PaymentState = {
  contributeSummary: undefined,
};

const paymentSlice = createSlice({
  initialState,
  name: 'payment',
  reducers: {
    calculatePriceRequest: {
      prepare: (payload: IRequestCalculatePrice) => ({ payload }),
      reducer: () => {},
    },
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
    decreaseContributeRequest: {
      prepare: (payload: IRequestDecreaseContribute) => ({ payload }),
      reducer: () => {},
    },
    getContributeSummaryRequest: {
      prepare: (payload: AppCallback<IContributeSummary>) => ({ payload }),
      reducer: () => {},
    },
    getContributeSummarySuccess: {
      prepare: (payload: IContributeSummary | undefined) => ({ payload }),
      reducer: (
        state,
        action: PayloadAction<IContributeSummary | undefined>,
      ) => {
        state.contributeSummary = action.payload;
      },
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
  calculatePriceRequest,
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
  removeCartItemRequest,
  updateCartItemRequest,
} = paymentSlice.actions;
export const paymentReducer = paymentSlice.reducer;
