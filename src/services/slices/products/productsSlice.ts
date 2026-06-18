import type { GetProductsPayload } from '@type/products';

import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
  initialState: {},
  name: 'products',
  reducers: {
    getProductsRequest: {
      prepare: (payload: GetProductsPayload = {}) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const { getProductsRequest } = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
