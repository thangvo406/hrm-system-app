import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';
import type {
  IRequestConfirmMemberShipVerify,
  IRequestGetUniversities,
  IRequestLogin,
  IRequestLoginSocial,
  IRequestRegisterUser,
  IRequestSendOTP,
  IRequestSendOtpForgotPass,
  IRequestSendOtpVerifyMembership,
  IRequestSubmitForgotPass,
  IRequestVerifyOTP,
  IRequestVerifyOtpForgotPass,
  ISelectSchoolRequest,
} from '@type/auth';

export type AuthState = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  universityId: number | undefined;
};

export type Credentials = {
  accessToken: string;
  refreshToken?: string;
};

export type SelectSchoolSuccessPayload = {
  universityId: number;
};

const initialState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
  universityId: undefined,
};

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    authFailure: () => {},
    authSuccess: (state, action: PayloadAction<Credentials>) => {
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
    // Triggers the saga; carries the social-login token + provider. Shared
    // across Google, Kakao, and Naver — the saga dispatches the same API.
    loginSocialRequest: {
      prepare: (payload: IRequestLoginSocial) => ({ payload }),
      reducer: () => {},
    },
    // Step 1 of multi-step registration.
    registerUserRequest: {
      prepare: (payload: IRequestRegisterUser) => ({ payload }),
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
    sendOtpForgotPassRequest: {
      prepare: (payload: IRequestSendOtpForgotPass) => ({ payload }),
      reducer: () => {},
    },
    // Forgot-password step 2: verify the OTP and receive a reset token.
    verifyOtpForgotPassRequest: {
      prepare: (payload: IRequestVerifyOtpForgotPass) => ({ payload }),
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
      action: PayloadAction<SelectSchoolSuccessPayload>,
    ) => {
      state.universityId = action.payload.universityId;
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
  confirmMemberShipVerifyRequest,
  getUniversitiesRequest,
  loginRequest,
  loginSocialRequest,
  logout,
  logoutSuccess,
  sendOtpVerifyMembershipRequest,
  refreshTokenRequest,
  registerUserRequest,
  selectSchoolRequest,
  selectSchoolSuccess,
  sendOTPRequest,
  sendOtpForgotPassRequest,
  setAccessToken,
  setCredentials,
  submitForgotPassRequest,
  verifyOTPRequest,
  verifyOtpForgotPassRequest,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
