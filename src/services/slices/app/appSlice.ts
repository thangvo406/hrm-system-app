import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import { logout } from '@services/slices/auth/authSlice';

export type AppState = {
  counter: number;
  loading: boolean;
};

export type StartupAppPayload = {
  onFailure?: (error: string) => void;
  onSuccess?: (isAuthenticated: boolean) => void;
};

const initialState: AppState = {
  counter: 0,
  loading: false,
};

const appSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(logout, () => initialState);
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
      reducer: state => {
        state.loading = true;
      },
    },
    incrementAsyncSuccess: (state, action: PayloadAction<number>) => {
      state.counter += action.payload;
      state.loading = false;
    },
    reset: () => initialState,
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
  startupApp,
} = appSlice.actions;

export const appReducer = appSlice.reducer;
