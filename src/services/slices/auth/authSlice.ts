import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

export type AuthState = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
};

export type Credentials = {
  accessToken: string;
  refreshToken?: string;
};

const initialState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
};

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    clearCredentials: () => initialState,
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setCredentials: (state, action: PayloadAction<Credentials>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
  },
});

export const { clearCredentials, setAccessToken, setCredentials } =
  authSlice.actions;

export const authReducer = authSlice.reducer;
