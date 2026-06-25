import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppCallback } from '@type/common';

import { createSlice } from '@reduxjs/toolkit';

import { logoutSuccess } from '@services/slices/auth/authSlice';

export type AppState = {
  counter: number;
  showFloatingCart: boolean;
};

export type StartupAppPayload = AppCallback<boolean>;

const initialState: AppState = {
  counter: 0,
  showFloatingCart: false,
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
    reset: () => initialState,
    setShowFloatingCart: (state, action: PayloadAction<boolean>) => {
      state.showFloatingCart = action.payload;
    },
    // Triggers the saga at app cold-start; result is delivered via callbacks.
    startupApp: {
      prepare: (payload: StartupAppPayload = {}) => ({ payload }),
      reducer: () => {
        // No state mutation — saga handles work, callbacks deliver result.
      },
    },
  },
});

export const {
  decrement,
  increment,
  incrementAsync,
  incrementAsyncSuccess,
  reset,
  setShowFloatingCart,
  startupApp,
} = appSlice.actions;

export const appReducer = appSlice.reducer;
