import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppCallback } from '@type/common';
import type { Profile } from '@services/request/account';
import type {
  IRequestGetTransactionHistories,
  IRequestTopUpWallet,
  IWallet,
} from '@type/wallet';
import type { ITotalItemCart } from '@type/payment';
import type {
  IRequestAutoCompleteAddress,
  IRequestGetBankInfo,
  IRequestGetVouchers,
  IRequestUpdateMembership,
  IRequestUpdatePassword,
  IRequestUpdatePushId,
  IUpdateAvatarRequest,
  IUpdateProfileInfoRequest,
  IRequestCreateQRCodeMember,
} from '@type/account';
import type {
  IRequestConfirmMemberShipVerify,
  IRequestDeleteAccount,
} from '@type/auth';

import { createSlice } from '@reduxjs/toolkit';

import { logoutSuccess } from '@services/slices/auth/authSlice';

export interface AccountState {
  currentWallet: IWallet | undefined;
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
      prepare: (payload: AppCallback = {}) => ({ payload }),
      reducer: () => {},
    },
    autoCompleteAddressRequest: {
      prepare: (payload: IRequestAutoCompleteAddress) => ({ payload }),
      reducer: () => {},
    },
    clearProfile: () => initialState,
    // Fire-and-forget: action này không có callback.
    confirmOTPRequestMembershipRequest: {
      prepare: (payload: IRequestConfirmMemberShipVerify) => ({ payload }),
      reducer: () => {},
    },
    deleteAccountRequest: {
      prepare: (payload: IRequestDeleteAccount) => ({ payload }),
      reducer: () => {},
    },
    generateQRCodeMemberRequest: {
      prepare: (payload: IRequestCreateQRCodeMember) => ({
        payload,
      }),
      reducer: () => {},
    },
    getBankInfoRequest: {
      prepare: (payload: IRequestGetBankInfo) => ({ payload }),
      reducer: () => {},
    },
    getTotalItemCartRequest: {
      prepare: (payload: AppCallback<ITotalItemCart> = {}) => ({ payload }),
      reducer: () => {},
    },
    getTotalItemCartSuccess: (state, action: PayloadAction<ITotalItemCart>) => {
      state.totalItemCart = action.payload.totalCart;
    },
    getCurrentWalletRequest: {
      prepare: (payload: AppCallback<IWallet> = {}) => ({ payload }),
      reducer: () => {},
    },
    getCurrentWalletSuccess: (state, action: PayloadAction<IWallet>) => {
      state.currentWallet = action.payload;
    },
    getMealTicketsRequest: {
      prepare: (payload: IRequestGetVouchers) => ({ payload }),
      reducer: () => {},
    },
    getProfileRequest: {
      prepare: (payload: AppCallback<Profile> = {}) => ({ payload }),
      reducer: () => {},
    },
    getProfileSuccess: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    getVouchersRequest: {
      prepare: (payload: IRequestGetVouchers) => ({ payload }),
      reducer: () => {},
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
    updateProfileInfoRequest: {
      prepare: (payload: IUpdateProfileInfoRequest) => ({ payload }),
      reducer: () => {},
    },
    uploadAvatarRequest: {
      prepare: (payload: IUpdateAvatarRequest) => ({ payload }),
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
  confirmOTPRequestMembershipRequest,
  deleteAccountRequest,
  generateQRCodeMemberRequest,
  getBankInfoRequest,
  getCurrentWalletRequest,
  getCurrentWalletSuccess,
  getMealTicketsRequest,
  getProfileRequest,
  getProfileSuccess,
  getTotalItemCartRequest,
  getTotalItemCartSuccess,
  getVouchersRequest,
  getContributeHistoriesRequest,
  topUpWalletRequest,
  updateMembershipRequest,
  updatePasswordRequest,
  updateProfileInfoRequest,
  updatePushIdRequest,
  uploadAvatarRequest,
} = accountSlice.actions;

export const accountReducer = accountSlice.reducer;
