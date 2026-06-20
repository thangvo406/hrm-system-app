import type {
  CheckoutProductPayload,
  GetProductByIdPayload,
  GetProductsPayload,
} from '@type/products';

import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
  initialState: {},
  name: 'products',
  reducers: {
    checkoutProductRequest: {
      prepare: (payload: CheckoutProductPayload) => ({ payload }),
      reducer: () => {},
    },
    getProductByIdRequest: {
      prepare: (payload: GetProductByIdPayload) => ({ payload }),
      reducer: () => {},
    },
    getProductsRequest: {
      prepare: (payload: GetProductsPayload) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const {
  checkoutProductRequest,
  getProductByIdRequest,
  getProductsRequest,
} = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
