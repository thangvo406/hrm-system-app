import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppCallback } from '@type/common';
import type { Profile } from '@services/request/account';
import type {
  IRequestGetTransactionHistories,
  IRequestTopUpWallet,
  Wallet,
} from '@type/wallet';
import type { TotalItemCart } from '@type/payment';
import type {
  IRequestAutoCompleteAddress,
  IRequestUpdateMembership,
  IRequestUpdatePassword,
  IRequestUpdatePushId,
} from '@type/account';
import type { AuthCallback, IRequestDeleteAccount } from '@type/auth';

import { createSlice } from '@reduxjs/toolkit';

import { logoutSuccess } from '@services/slices/auth/authSlice';

export interface AccountState {
  currentWallet: Wallet | undefined;
  profile: Profile | undefined;
  pushId: string | undefined;
  totalItemCart: number;
}

const initialState: AccountState = {
  currentWallet: undefined,
  profile: undefined,
  pushId: undefined,
  totalItemCart: 0,
};

const accountSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(logoutSuccess, () => initialState);
  },
  initialState,
  name: 'account',
  reducers: {
    activeAccountRequest: {
      prepare: (payload: AuthCallback = {}) => ({ payload }),
      reducer: () => {},
    },
    autoCompleteAddressRequest: {
      prepare: (payload: IRequestAutoCompleteAddress) => ({ payload }),
      reducer: () => {},
    },
    clearProfile: () => initialState,
    deleteAccountRequest: {
      prepare: (payload: IRequestDeleteAccount) => ({ payload }),
      reducer: () => {},
    },
    getTotalItemCartRequest: {
      prepare: (payload: AppCallback<TotalItemCart> = {}) => ({ payload }),
      reducer: () => {},
    },
    getTotalItemCartSuccess: (state, action: PayloadAction<TotalItemCart>) => {
      state.totalItemCart = action.payload.totalCart;
    },
    getCurrentWalletRequest: {
      prepare: (payload: AppCallback<Wallet> = {}) => ({ payload }),
      reducer: () => {},
    },
    getCurrentWalletSuccess: (state, action: PayloadAction<Wallet>) => {
      state.currentWallet = action.payload;
    },
    getProfileRequest: {
      prepare: (payload: AppCallback<Profile> = {}) => ({ payload }),
      reducer: () => {},
    },
    getProfileSuccess: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    getContributeHistoriesRequest: {
      prepare: (payload: IRequestGetTransactionHistories) => ({ payload }),
      reducer: () => {},
    },
    topUpWalletRequest: {
      prepare: (payload: IRequestTopUpWallet) => ({ payload }),
      reducer: () => {},
    },
    updateMembershipRequest: {
      prepare: (payload: IRequestUpdateMembership) => ({ payload }),
      reducer: () => {},
    },
    updatePasswordRequest: {
      prepare: (payload: IRequestUpdatePassword) => ({ payload }),
      reducer: () => {},
    },
    updatePushIdRequest: {
      prepare: (payload: IRequestUpdatePushId) => ({ payload }),
      reducer: (state, action: PayloadAction<IRequestUpdatePushId>) => {
        state.pushId = action.payload.subscriptionId;
      },
    },
  },
});

export const {
  activeAccountRequest,
  autoCompleteAddressRequest,
  clearProfile,
  deleteAccountRequest,
  getCurrentWalletRequest,
  getCurrentWalletSuccess,
  getProfileRequest,
  getProfileSuccess,
  getTotalItemCartRequest,
  getTotalItemCartSuccess,
  getContributeHistoriesRequest,
  topUpWalletRequest,
  updateMembershipRequest,
  updatePasswordRequest,
  updatePushIdRequest,
} = accountSlice.actions;

export const accountReducer = accountSlice.reducer;

