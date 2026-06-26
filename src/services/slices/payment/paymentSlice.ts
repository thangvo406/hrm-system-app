import type {
  CheckoutInfo,
  CreateOrderPayload,
  GetInfoProductCheckoutPayload,
  GetListCartPayload,
  GetOrderHistoriesPayload,
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
  getInfoProductCheckoutRequest,
  getListCartRequest,
  getOrderHistoriesRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} = paymentSlice.actions;
export const paymentReducer = paymentSlice.reducer;
