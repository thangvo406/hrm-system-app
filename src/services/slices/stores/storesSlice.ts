import type {
  GetStoreDetailActionPayload,
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
    getStoresRequest: {
      prepare: (payload: GetStoresActionPayload) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const { getStoreDetailRequest, getStoresRequest } = storesSlice.actions;
export const storesReducer = storesSlice.reducer;
