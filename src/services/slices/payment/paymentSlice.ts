import type {
  CheckoutInfo,
  GetInfoProductCheckoutPayload,
  GetListCartPayload,
  GetTotalItemCartPayload,
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
    getTotalItemCartRequest: {
      prepare: (payload: GetTotalItemCartPayload = {}) => ({ payload }),
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
  getTotalItemCartRequest,
  getInfoProductCheckoutRequest,
  getListCartRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} = paymentSlice.actions;
export const paymentReducer = paymentSlice.reducer;
