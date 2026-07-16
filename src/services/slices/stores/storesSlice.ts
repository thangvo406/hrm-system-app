import type { AppCallback } from '@type/common';
import type {
  IRequestGetStoreDetail,
  IRequestGetStores,
  StoreItem,
} from '@type/store';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type StoresState = {
  storeOrderRecent: StoreItem | undefined;
};

const initialState: StoresState = {
  storeOrderRecent: undefined,
};

const storesSlice = createSlice({
  initialState,
  name: 'stores',
  reducers: {
    getStoreDetailRequest: {
      prepare: (payload: IRequestGetStoreDetail) => ({ payload }),
      reducer: () => {},
    },
    getStoreOrderRecentRequest: {
      prepare: (payload: AppCallback<StoreItem[]> = {}) => ({
        payload,
      }),
      reducer: () => {},
    },
    getStoresRequest: {
      prepare: (payload: IRequestGetStores) => ({ payload }),
      reducer: () => {},
    },
    setStoreOrderRecent: {
      prepare: (payload: StoreItem | undefined) => ({ payload }),
      reducer: (state, action: PayloadAction<StoreItem | undefined>) => {
        state.storeOrderRecent = action.payload;
      },
    },
  },
});

export const {
  getStoreDetailRequest,
  getStoreOrderRecentRequest,
  getStoresRequest,
  setStoreOrderRecent,
} = storesSlice.actions;
export const storesReducer = storesSlice.reducer;
