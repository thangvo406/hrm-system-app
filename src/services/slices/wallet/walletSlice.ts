import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  GetCurrentWalletPayload,
  GetTransactionHistoriesPayload,
  TopUpWalletPayload,
  Wallet,
} from '@type/wallet';

import { createSlice } from '@reduxjs/toolkit';

export type WalletState = {
  currentWallet: Wallet | undefined;
};

const initialState: WalletState = {
  currentWallet: undefined,
};

const walletSlice = createSlice({
  initialState,
  name: 'wallet',
  reducers: {
    getCurrentWalletRequest: {
      prepare: (payload: GetCurrentWalletPayload = {}) => ({ payload }),
      reducer: () => {},
    },
    getCurrentWalletSuccess: (state, action: PayloadAction<Wallet>) => {
      state.currentWallet = action.payload;
    },
    getTransactionHistoriesRequest: {
      prepare: (payload: GetTransactionHistoriesPayload) => ({ payload }),
      reducer: () => {},
    },
    topUpWalletRequest: {
      prepare: (payload: TopUpWalletPayload) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const {
  getCurrentWalletRequest,
  getCurrentWalletSuccess,
  getTransactionHistoriesRequest,
  topUpWalletRequest,
} = walletSlice.actions;
export const walletReducer = walletSlice.reducer;
