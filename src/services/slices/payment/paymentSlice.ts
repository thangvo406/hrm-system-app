import type { AppCallback } from '@type/common';
import type {
  CheckoutInfo,
  ContributeSummary,
  IRequestCreateOrder,
  IRequestGenerateQRCode,
  IRequestGetCartDetail,
  IRequestGetContributeHistoryDetail,
  IRequestGetHistoriesDividend,
  IRequestGetInfoProductCheckout,
  IRequestGetListCart,
  IRequestGetOrderHistories,
  IRequestGetOrderHistoryDetail,
  IRequestIncreaseContribute,
  IRequestInitCharge,
  IRequestRemoveCartItem,
  IRequestUpdateCartItem,
} from '@type/payment';

import { createSlice } from '@reduxjs/toolkit';

export interface PaymentState {
  checkoutInfo: CheckoutInfo | undefined;
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
    generateQRCodeRequest: {
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
      prepare: (payload: AppCallback<ContributeSummary>) => ({ payload }),
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
  },
});

export const {
  createOrderRequest,
  generateQRCodeRequest,
  getAddressOrderRecentRequest,
  getCartDetailRequest,
  getContributeHistoryDetailRequest,
  getContributeSummaryRequest,
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
