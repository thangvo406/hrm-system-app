import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  CheckoutInfo,
  GetInfoProductCheckoutPayload,
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
  },
});

export const { getInfoProductCheckoutRequest } = paymentSlice.actions;
export const paymentReducer = paymentSlice.reducer;
