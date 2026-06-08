import { createSlice } from '@reduxjs/toolkit';

export type CounterState = {
  value: number;
};

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  initialState,
  name: 'counter',
  reducers: {
    decrement: (state) => {
      state.value -= 1;
    },
    increment: (state) => {
      state.value += 1;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const { decrement, increment, reset } = counterSlice.actions;

export const counterReducer = counterSlice.reducer;
