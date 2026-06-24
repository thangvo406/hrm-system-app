import type {
  CheckoutInfo,
  GetInfoProductCheckoutPayload,
  RemoveCartItemPayload,
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
    getInfoProductCheckoutRequest: {
      prepare: (payload: GetInfoProductCheckoutPayload) => ({ payload }),
      reducer: () => {},
    },
    removeCartItemRequest: {
      prepare: (payload: RemoveCartItemPayload) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const { getInfoProductCheckoutRequest, removeCartItemRequest } =
  paymentSlice.actions;
export const paymentReducer = paymentSlice.reducer;
