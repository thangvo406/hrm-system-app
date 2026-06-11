import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '@services/request/account';

import { createSlice } from '@reduxjs/toolkit';

import { logout } from '@services/slices/auth/authSlice';

export type AccountCallback = {
  onFailure?: (error: string) => void;
  onSuccess?: (profile: Profile) => void;
};

export type GetProfilePayload = AccountCallback;

export type AccountState = {
  loading: boolean;
  profile: Profile | undefined;
};

const initialState: AccountState = {
  loading: false,
  profile: undefined,
};

const accountSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(logout, () => initialState);
  },
  initialState,
  name: 'account',
  reducers: {
    clearProfile: () => initialState,
    // Triggers the saga to fetch the current user's profile.
    getProfileRequest: {
      prepare: (payload: GetProfilePayload = {}) => ({ payload }),
      reducer: state => {
        state.loading = true;
      },
    },
    getProfileSuccess: (state, action: PayloadAction<Profile>) => {
      state.loading = false;
      state.profile = action.payload;
    },
  },
});

export const { clearProfile, getProfileRequest, getProfileSuccess } =
  accountSlice.actions;

export const accountReducer = accountSlice.reducer;
