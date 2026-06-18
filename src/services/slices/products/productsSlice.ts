import type { GetProductByIdPayload, GetProductsPayload } from '@type/products';

import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
  initialState: {},
  name: 'products',
  reducers: {
    getProductByIdRequest: {
      prepare: (payload: GetProductByIdPayload = {}) => ({ payload }),
      reducer: () => {},
    },
    getProductsRequest: {
      prepare: (payload: GetProductsPayload = {}) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const { getProductByIdRequest, getProductsRequest } =
  productsSlice.actions;
export const productsReducer = productsSlice.reducer;
