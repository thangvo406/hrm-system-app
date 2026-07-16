import type {
  IRequestCheckoutProduct,
  IRequestGetProductById,
  IRequestGetProducts,
} from '@type/products';

import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
  initialState: {},
  name: 'products',
  reducers: {
    checkoutProductRequest: {
      prepare: (payload: IRequestCheckoutProduct) => ({ payload }),
      reducer: () => {},
    },
    getProductByIdRequest: {
      prepare: (payload: IRequestGetProductById) => ({ payload }),
      reducer: () => {},
    },
    getProductsRequest: {
      prepare: (payload: IRequestGetProducts) => ({ payload }),
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
