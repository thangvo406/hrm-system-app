import type { PayloadAction } from '@reduxjs/toolkit';
import type { IAppConfig, IRequestGetAppConfig } from '@type/common';
import type { AppCallback } from '@type/common';

import { createSlice } from '@reduxjs/toolkit';

import { logoutSuccess } from '@services/slices/auth/authSlice';

export interface AppState {
  counter: number;
  showFloatingCart: boolean;
  isEnablePaymentCard: boolean;
  isEnableAddress: boolean;
  config: IAppConfig | undefined;
}

const initialState: AppState = {
  counter: 0,
  showFloatingCart: false,
  isEnablePaymentCard: false,
  isEnableAddress: false,
  config: undefined,
};

const appSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(logoutSuccess, () => initialState);
  },
  initialState,
  name: 'app',
  reducers: {
    decrement: state => {
      state.counter -= 1;
    },
    // Triggers the saga; the fetched config is stored by getAppConfigSuccess.
    getAppConfigRequest: {
      prepare: (payload: IRequestGetAppConfig = {}) => ({ payload }),
      reducer: () => {},
    },
    getAppConfigSuccess: (state, action: PayloadAction<IAppConfig>) => {
      state.config = action.payload;
    },
    increment: state => {
      state.counter += 1;
    },
    // Triggers the saga; payload is the amount to add asynchronously.
    incrementAsync: {
      prepare: (amount: number) => ({ payload: amount }),
      reducer: () => {},
    },
    incrementAsyncSuccess: (state, action: PayloadAction<number>) => {
      state.counter += action.payload;
    },
    updateEnablePaymentCard: (state, action: PayloadAction<boolean>) => {
      state.isEnablePaymentCard = action.payload;
    },
    reset: () => initialState,
    setShowFloatingCart: (state, action: PayloadAction<boolean>) => {
      state.showFloatingCart = action.payload;
    },
    // Triggers the saga at app cold-start; result is delivered via callbacks.
    startupApp: {
      prepare: (payload: AppCallback<boolean> = {}) => ({ payload }),
      reducer: () => {
        // No state mutation — saga handles work, callbacks deliver result.
      },
    },
  },
});

export const {
  decrement,
  getAppConfigRequest,
  getAppConfigSuccess,
  increment,
  incrementAsync,
  incrementAsyncSuccess,
  reset,
  setShowFloatingCart,
  updateEnablePaymentCard,
  startupApp,
} = appSlice.actions;

export const appReducer = appSlice.reducer;
