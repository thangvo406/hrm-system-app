import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

export type AuthState = {
  accessToken: string | undefined;
  error: string | undefined;
  loading: boolean;
  refreshToken: string | undefined;
};

export type Credentials = {
  accessToken: string;
  refreshToken?: string;
};

export type AuthCallback = {
  onSuccess?: () => void;
  onFailure?: (error: string) => void;
};

export type LoginPayload = {
  deviceId?: string;
  deviceName?: string;
  email: string;
  password: string;
  platform?: string;
} & AuthCallback;

export type RegisterPayload = {
  email: string;
  name: string;
  password: string;
} & AuthCallback;

const initialState: AuthState = {
  accessToken: undefined,
  error: undefined,
  loading: false,
  refreshToken: undefined,
};

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    authFailure: (state, _: PayloadAction<string>) => {
      state.loading = false;
    },
    authSuccess: (state, action: PayloadAction<Credentials>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.error = undefined;
      state.loading = false;
    },
    clearCredentials: () => initialState,
    // Triggers the saga; carries the login form values.
    loginRequest: {
      prepare: (payload: LoginPayload) => ({ payload }),
      reducer: state => {
        state.error = undefined;
        state.loading = true;
      },
    },
    // Triggers the saga; carries the register form values.
    registerRequest: {
      prepare: (payload: RegisterPayload) => ({ payload }),
      reducer: state => {
        state.error = undefined;
        state.loading = true;
      },
    },
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

export const {
  authFailure,
  authSuccess,
  clearCredentials,
  loginRequest,
  registerRequest,
  setAccessToken,
  setCredentials,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
