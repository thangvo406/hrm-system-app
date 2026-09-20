import type { PayloadAction } from '@reduxjs/toolkit';
import type { ICredentials, IRequestLogin } from '@type/auth';

import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

const initialState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
};

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    // ─── Đăng nhập ───────────────────────────────────────────────────────────
    // Triggers the saga; carries the login form values.
    loginRequest: {
      prepare: (payload: IRequestLogin) => ({ payload }),
      reducer: () => {},
    },
    authSuccess: (state, action: PayloadAction<ICredentials>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }
    },

    // ─── Token ───────────────────────────────────────────────────────────────
    // Triggers the saga to swap the refresh token for a fresh pair.
    refreshTokenRequest: () => {},
    setCredentials: (state, action: PayloadAction<ICredentials>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    // Dispatched by the axios interceptor when a token refresh fails.
    clearCredentials: () => initialState,

    // ─── Đăng xuất ───────────────────────────────────────────────────────────
    // Triggers the saga to run cleanup (delete push id, purge storage).
    // Other slices reset to initialState when they receive `logoutSuccess`.
    logout: state => state,
    // Dispatched by the saga after all async cleanup is complete. All other
    // slices listen for this to reset themselves.
    logoutSuccess: () => initialState,
  },
});

export const {
  authSuccess,
  clearCredentials,
  loginRequest,
  logout,
  logoutSuccess,
  refreshTokenRequest,
  setCredentials,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
