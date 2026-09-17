import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';
import type {
  IRequestConfirmMemberShipVerify,
  IRequestCreateLinkVerifyInfoUser,
  IRequestGetUniversities,
  IRequestLogin,
  IRequestRegisterUser,
  IRequestSendOTP,
  IRequestCreateLinkVerifyForgotPass,
  IRequestSendOtpVerifyMembership,
  IRequestSubmitForgotPass,
  IRequestVerifyOTP,
  ICredentials,
  IRequestVerifyUserNewLogin,
  ISelectSchoolRequest,
  ISelectSchoolSuccessPayload,
  ISetUniversitiesPayload,
  IUniversityData,
} from '@type/auth';

export interface AuthState {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  universityData: IUniversityData;
  universityId: number | undefined;
}

const initialState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
  universityData: {
    content: [],
    isLast: false,
    page: 0,
  },
  universityId: undefined,
};

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    authFailure: () => {},
    authSuccess: (state, action: PayloadAction<ICredentials>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    clearCredentials: () => initialState,
    // Triggers the saga to run cleanup (delete push id, purge storage).
    // Other slices reset to initialState when they receive `logoutSuccess`.
    logout: state => state,
    // Dispatched by the saga after all async cleanup is complete. All other
    // slices listen for this to reset themselves.
    logoutSuccess: () => initialState,
    // Triggers the saga; carries the login form values.
    loginRequest: {
      prepare: (payload: IRequestLogin) => ({ payload }),
      reducer: () => {},
    },
    refreshTokenRequest: {
      prepare: (payload?: any) => ({ payload }),
      reducer: () => {},
    },
    // Step 1 of multi-step registration.
    registerUserRequest: {
      prepare: (payload: IRequestRegisterUser) => ({ payload }),
      reducer: () => {},
    },
    // Creates the identity-verification link/cert webview info for a
    // registered user (used to open the cert WebView dialog).
    createLinkVerifyUserRequest: {
      prepare: (payload: IRequestCreateLinkVerifyInfoUser) => ({ payload }),
      reducer: () => {},
    },
    // Step 2: send OTP to phone.
    sendOTPRequest: {
      prepare: (payload: IRequestSendOTP) => ({ payload }),
      reducer: () => {},
    },
    // Step 3: verify OTP.
    verifyOTPRequest: {
      prepare: (payload: IRequestVerifyOTP) => ({ payload }),
      reducer: () => {},
    },
    // Fetch the list of universities for the school picker.
    getUniversitiesRequest: {
      prepare: (payload: IRequestGetUniversities = {}) => ({ payload }),
      reducer: () => {},
    },
    // Forgot-password step 1: send OTP to the user's identifier (email/phone).
    createLinkVerifyForgotPassRequest: {
      prepare: (payload: IRequestCreateLinkVerifyForgotPass) => ({ payload }),
      reducer: () => {},
    },
    // Forgot-password step 3: submit a new password with the reset token.
    submitForgotPassRequest: {
      prepare: (payload: IRequestSubmitForgotPass) => ({ payload }),
      reducer: () => {},
    },
    sendOtpVerifyMembershipRequest: {
      prepare: (payload: IRequestSendOtpVerifyMembership) => ({ payload }),
      reducer: () => {},
    },
    confirmMemberShipVerifyRequest: {
      prepare: (payload: IRequestConfirmMemberShipVerify) => ({ payload }),
      reducer: () => {},
    },
    // Creates the identity-verification link/cert webview info for a user
    // logging in with an initial (not yet confirmed) password.
    verifyUserNewLoginRequest: {
      prepare: (payload: IRequestVerifyUserNewLogin) => ({ payload }),
      reducer: () => {},
    },
    // Persist the user's selected university on the session.
    selectSchoolRequest: {
      prepare: (payload: ISelectSchoolRequest) => ({ payload }),
      reducer: () => {},
    },
    // Triggered by the saga after the select-school API succeeds. Stores
    // the chosen `universityId` in the auth slice so downstream features
    // (e.g. account, payments) can read it from the store.
    selectSchoolSuccess: (
      state,
      action: PayloadAction<ISelectSchoolSuccessPayload>,
    ) => {
      state.universityId = action.payload.universityId;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    // Cache the default (no-keyword) universities list in the store. Page 0
    // replaces the list; later pages append, so re-entering the school picker
    // shows the previously loaded pages without refetching.
    getUniversitiesSuccess: (
      state,
      action: PayloadAction<ISetUniversitiesPayload>,
    ) => {
      const { content, last, page } = action.payload || {};

      state.universityData = {
        content:
          page === 0
            ? content
            : [...(state.universityData?.content || []), ...content],
        isLast: last,
        page,
      };
    },
    setCredentials: (state, action: PayloadAction<ICredentials>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
  },
});

export const {
  authFailure,
  authSuccess,
  clearCredentials,
  confirmMemberShipVerifyRequest,
  createLinkVerifyUserRequest,
  getUniversitiesRequest,
  loginRequest,
  logout,
  logoutSuccess,
  sendOtpVerifyMembershipRequest,
  refreshTokenRequest,
  registerUserRequest,
  selectSchoolRequest,
  selectSchoolSuccess,
  sendOTPRequest,
  createLinkVerifyForgotPassRequest,
  getUniversitiesSuccess,
  setAccessToken,
  setCredentials,
  submitForgotPassRequest,
  verifyOTPRequest,
  verifyUserNewLoginRequest,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
