import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '@services/request/account';

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
  profile: Profile | undefined;
  pushId: string | undefined;
};

const initialState: AccountState = {
  profile: undefined,
  pushId: undefined,
};

const accountSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(logoutSuccess, () => initialState);
  },
  initialState,
  name: 'account',
  reducers: {
    clearProfile: () => initialState,
    getProfileRequest: {
      prepare: (payload: GetProfilePayload = {}) => ({ payload }),
      reducer: () => {},
    },
    getProfileSuccess: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
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
  getProfileRequest,
  getProfileSuccess,
  updateMembershipRequest,
  updatePushIdRequest,
} = accountSlice.actions;

export const accountReducer = accountSlice.reducer;
