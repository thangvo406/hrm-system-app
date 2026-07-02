import type {
  CheckoutInfo,
  CreateOrderPayload,
  GenerateQRCodePayload,
  GetAddressOrderRecentPayload,
  GetInfoProductCheckoutPayload,
  GetListCartPayload,
  GetOrderHistoriesPayload,
  GetOrderHistoryDetailPayload,
  RemoveCartItemPayload,
  UpdateCartItemPayload,
} from '@type/payment';

import { createSlice } from '@reduxjs/toolkit';

export type PaymentState = {
  checkoutInfo: CheckoutInfo | undefined;
};

const initialState: PaymentState = {
  checkoutInfo: undefined,
};

const paymentSlice = createSlice({
  initialState,
  name: 'payment',
  reducers: {
    createOrderRequest: {
      prepare: (payload: CreateOrderPayload) => ({ payload }),
      reducer: () => {},
    },
    generateQRCodeRequest: {
      prepare: (payload: GenerateQRCodePayload) => ({ payload }),
      reducer: () => {},
    },
    getAddressOrderRecentRequest: {
      prepare: (payload: GetAddressOrderRecentPayload = {}) => ({ payload }),
      reducer: () => {},
    },
    getInfoProductCheckoutRequest: {
      prepare: (payload: GetInfoProductCheckoutPayload) => ({ payload }),
      reducer: () => {},
    },
    getListCartRequest: {
      prepare: (payload: GetListCartPayload) => ({ payload }),
      reducer: () => {},
    },
    getOrderHistoriesRequest: {
      prepare: (payload: GetOrderHistoriesPayload) => ({ payload }),
      reducer: () => {},
    },
    getOrderHistoryDetailRequest: {
      prepare: (payload: GetOrderHistoryDetailPayload) => ({ payload }),
      reducer: () => {},
    },
    removeCartItemRequest: {
      prepare: (payload: RemoveCartItemPayload) => ({ payload }),
      reducer: () => {},
    },
    updateCartItemRequest: {
      prepare: (payload: UpdateCartItemPayload) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const {
  createOrderRequest,
  generateQRCodeRequest,
  getAddressOrderRecentRequest,
  getInfoProductCheckoutRequest,
  getListCartRequest,
  getOrderHistoriesRequest,
  getOrderHistoryDetailRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} = paymentSlice.actions;
export const paymentReducer = paymentSlice.reducer;
