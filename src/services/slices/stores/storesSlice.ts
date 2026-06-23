import type {
  GetStoreDetailActionPayload,
  GetStoreOrderRecentActionPayload,
  GetStoresActionPayload,
} from '@type/store';

import { createSlice } from '@reduxjs/toolkit';

const storesSlice = createSlice({
  initialState: {},
  name: 'stores',
  reducers: {
    getStoreDetailRequest: {
      prepare: (payload: GetStoreDetailActionPayload) => ({ payload }),
      reducer: () => {},
    },
    getStoreOrderRecentRequest: {
      prepare: (payload: GetStoreOrderRecentActionPayload = {}) => ({
        payload,
      }),
      reducer: () => {},
    },
    getStoresRequest: {
      prepare: (payload: GetStoresActionPayload) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const {
  getStoreDetailRequest,
  getStoreOrderRecentRequest,
  getStoresRequest,
} = storesSlice.actions;
export const storesReducer = storesSlice.reducer;
