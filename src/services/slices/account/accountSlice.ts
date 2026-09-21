import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppCallback } from '@type/common';
import type { Profile } from '@services/request/account';

import { createSlice } from '@reduxjs/toolkit';

import { logoutSuccess } from '@services/slices/auth/authSlice';

export interface AccountState {
  profile: Profile | undefined;
}

const initialState: AccountState = {
  profile: undefined,
};

const accountSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(logoutSuccess, () => initialState);
  },
  initialState,
  name: 'account',
  reducers: {
    getProfileRequest: {
      prepare: (payload: AppCallback<Profile> = {}) => ({ payload }),
      reducer: () => {},
    },
    getProfileSuccess: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
  },
});

export const { getProfileRequest, getProfileSuccess } = accountSlice.actions;

export const accountReducer = accountSlice.reducer;
