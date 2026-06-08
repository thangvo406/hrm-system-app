import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

export type AppState = {
  counter: number;
  loading: boolean;
};

const initialState: AppState = {
  counter: 0,
  loading: false,
};

const appSlice = createSlice({
  initialState,
  name: 'app',
  reducers: {
    decrement: (state) => {
      state.counter -= 1;
    },
    increment: (state) => {
      state.counter += 1;
    },
    // Triggers the saga; payload is the amount to add asynchronously.
    incrementAsync: {
      prepare: (amount: number) => ({ payload: amount }),
      reducer: (state) => {
        state.loading = true;
      },
    },
    incrementAsyncSuccess: (state, action: PayloadAction<number>) => {
      state.counter += action.payload;
      state.loading = false;
    },
    reset: () => initialState,
  },
});

export const {
  decrement,
  increment,
  incrementAsync,
  incrementAsyncSuccess,
  reset,
} = appSlice.actions;

export const appReducer = appSlice.reducer;
