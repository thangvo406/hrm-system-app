import type { AppCallback } from '@type/common';
import type {
  IRequestGetStoreDetail,
  IRequestGetStores,
  IStoreItem,
} from '@type/store';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type StoresState = {
  storeOrderRecent: IStoreItem | undefined;
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
      prepare: (payload: AppCallback<IStoreItem[]> = {}) => ({
        payload,
      }),
      reducer: () => {},
    },
    getStoresRequest: {
      prepare: (payload: IRequestGetStores) => ({ payload }),
      reducer: () => {},
    },
    setStoreOrderRecent: {
      prepare: (payload: IStoreItem | undefined) => ({ payload }),
      reducer: (state, action: PayloadAction<IStoreItem | undefined>) => {
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
