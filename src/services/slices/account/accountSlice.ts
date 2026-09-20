import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppCallback } from '@type/common';
import type { Profile } from '@services/request/account';
import type { IRequestUpdatePushIdCallback } from '@type/account';

import { createSlice } from '@reduxjs/toolkit';

import { logoutSuccess } from '@services/slices/auth/authSlice';

export interface AccountState {
  profile: Profile | undefined;
  pushId: string | undefined;
}

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
      prepare: (payload: AppCallback<Profile> = {}) => ({ payload }),
      reducer: () => {},
    },
    getProfileSuccess: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    updatePushIdRequest: {
      prepare: (payload: IRequestUpdatePushIdCallback) => ({ payload }),
      reducer: (state, action: PayloadAction<IRequestUpdatePushIdCallback>) => {
        state.pushId = action.payload.subscriptionId;
      },
    },
  },
});

export const {
  clearProfile,
  getProfileRequest,
  getProfileSuccess,
  updatePushIdRequest,
} = accountSlice.actions;

export const accountReducer = accountSlice.reducer;
