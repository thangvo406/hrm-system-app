import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  GetCurrentWalletPayload,
  GetTransactionHistoriesPayload,
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
  },
});

export const {
  getCurrentWalletRequest,
  getCurrentWalletSuccess,
  getTransactionHistoriesRequest,
} = walletSlice.actions;
export const walletReducer = walletSlice.reducer;
