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
    getInfoProductCheckoutSuccess: (
      state,
      action: PayloadAction<CheckoutInfo>,
    ) => {
      state.checkoutInfo = action.payload;
    },
  },
});

export const { getInfoProductCheckoutRequest, getInfoProductCheckoutSuccess } =
  paymentSlice.actions;
export const paymentReducer = paymentSlice.reducer;
