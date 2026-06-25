import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '@services/request/account';
import type {
  GetCurrentWalletPayload,
  GetTransactionHistoriesPayload,
  TopUpWalletPayload,
  Wallet,
} from '@type/wallet';
import type { GetTotalItemCartPayload, TotalItemCart } from '@type/payment';

import { createSlice } from '@reduxjs/toolkit';

import { logoutSuccess } from '@services/slices/auth/authSlice';

export type AccountCallback = {
  onFailure?: (error: string) => void;
  onSuccess?: (profile: Profile) => void;
};

export type GetProfilePayload = AccountCallback;

export type UpdatePushIdPayload = {
  optedIn: boolean;
  pushToken: string;
  subscriptionId: string;
};

export type UpdateMembershipCallback = {
  onFailure?: (error: string) => void;
  onSuccess?: () => void;
};

export type UpdateMembershipPayload = UpdateMembershipCallback & {
  membershipType: string;
};

export type AccountState = {
  currentWallet: Wallet | undefined;
  profile: Profile | undefined;
  pushId: string | undefined;
  totalItemCart: number;
};

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
    clearProfile: () => initialState,
    getTotalItemCartRequest: {
      prepare: (payload: GetTotalItemCartPayload = {}) => ({ payload }),
      reducer: () => {},
    },
    getTotalItemCartSuccess: (state, action: PayloadAction<TotalItemCart>) => {
      state.totalItemCart = action.payload.totalCart;
    },
    getCurrentWalletRequest: {      prepare: (payload: GetCurrentWalletPayload = {}) => ({ payload }),
      reducer: () => {},
    },
    getCurrentWalletSuccess: (state, action: PayloadAction<Wallet>) => {
      state.currentWallet = action.payload;
    },
    getProfileRequest: {
      prepare: (payload: GetProfilePayload = {}) => ({ payload }),
      reducer: () => {},
    },
    getProfileSuccess: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    getTransactionHistoriesRequest: {
      prepare: (payload: GetTransactionHistoriesPayload) => ({ payload }),
      reducer: () => {},
    },
    topUpWalletRequest: {
      prepare: (payload: TopUpWalletPayload) => ({ payload }),
      reducer: () => {},
    },
    updateMembershipRequest: {
      prepare: (payload: UpdateMembershipPayload = {}) => ({ payload }),
      reducer: () => {},
    },
    updatePushIdRequest: {
      prepare: (payload: UpdatePushIdPayload) => ({ payload }),
      reducer: (state, action: PayloadAction<UpdatePushIdPayload>) => {
        state.pushId = action.payload.subscriptionId;
      },
    },
  },
});

export const {
  clearProfile,
  getCurrentWalletRequest,
  getCurrentWalletSuccess,
  getProfileRequest,
  getProfileSuccess,
  getTotalItemCartRequest,
  getTotalItemCartSuccess,
  getTransactionHistoriesRequest,
  topUpWalletRequest,
  updateMembershipRequest,
  updatePushIdRequest,
} = accountSlice.actions;

export const accountReducer = accountSlice.reducer;

