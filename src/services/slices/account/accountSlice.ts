import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppCallback } from '@type/common';
import type { Profile } from '@services/request/account';

import { createSlice } from '@reduxjs/toolkit';

import { logoutSuccess } from '@services/slices/auth/authSlice';
import { IOffice, IRequestGetListOffice } from '@type';

export interface AccountState {
  profile?: Profile;
  offices?: IOffice[];
}

const initialState: AccountState = {
  profile: undefined,
  offices: undefined,
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
    getListOfficeSuccess: (state, action: PayloadAction<IOffice[]>) => {
      state.offices = action.payload;
    },
    getProfileSuccess: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    getListOfficeRequest: {
      prepare: (payload: IRequestGetListOffice) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const {
  getProfileRequest,
  getListOfficeSuccess,
  getListOfficeRequest,
  getProfileSuccess,
} = accountSlice.actions;

export const accountReducer = accountSlice.reducer;
