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

export type AuthCallback = {
  onFailure?: (error: string, status?: number) => void;
  onSuccess?: (data?: any) => void;
};

export type LoginPayload = {
  email: string;
  password: string;
} & AuthCallback;

export type RegisterUserPayload = {
  email: string;
  name: string;
  password: string;
} & AuthCallback;

export type SendOTPPayload = {
  email: string;
  phone: string;
} & AuthCallback;

export type LoginSocialPayload = {
  accessToken?: string;
  authorizationCode?: string;
  codeVerifier?: string;
  idToken?: string;
  provider: 'GOOGLE' | 'KAKAO' | 'NAVER';
  redirectUri?: string;
  state?: string;
} & AuthCallback;
export type VerifyOTPPayload = {
  email?: string;
  otp?: string;
  phone?: string;
  phoneVerificationToken?: string;
  termsAgreed: boolean;
  identityNumber?: string;
} & AuthCallback;

export type CompleteRegisterPayload = {
  email?: string;
  membershipAffiliationType?: string;
  membershipType?: string;
  universityId?: string;
  universityName?: string;
  signupToken?: string;
} & AuthCallback;

export type GetUniversitiesPayload = AuthCallback;

export type SendOtpForgotPassPayload = {
  identifier: string;
} & AuthCallback;

export type VerifyOtpForgotPassPayload = {
  email: string;
  identityNumber: string;
  otp: string;
  phone: string;
  fullName: string;
  phoneVerificationToken: string;
  termsAgreed: boolean;
} & AuthCallback;

export type SubmitForgotPassPayload = {
  confirmPassword: string;
  newPassword: string;
  resetToken: string;
} & AuthCallback;

const initialState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
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
      prepare: (payload: LoginPayload) => ({ payload }),
      reducer: () => {},
    },
    refreshTokenRequest: {
      prepare: (payload?: any) => ({ payload }),
      reducer: () => {},
    },
    // Triggers the saga; carries the social-login token + provider. Shared
    // across Google, Kakao, and Naver — the saga dispatches the same API.
    loginSocialRequest: {
      prepare: (payload: LoginSocialPayload) => ({ payload }),
      reducer: () => {},
    },
    // Step 1 of multi-step registration.
    registerUserRequest: {
      prepare: (payload: RegisterUserPayload) => ({ payload }),
      reducer: () => {},
    },
    // Step 2: send OTP to phone.
    sendOTPRequest: {
      prepare: (payload: SendOTPPayload) => ({ payload }),
      reducer: () => {},
    },
    // Step 3: verify OTP.
    verifyOTPRequest: {
      prepare: (payload: VerifyOTPPayload) => ({ payload }),
      reducer: () => {},
    },
    // Step 4: complete registration with university/membership info.
    completeRegisterRequest: {
      prepare: (payload: CompleteRegisterPayload) => ({ payload }),
      reducer: () => {},
    },
    // Fetch the list of universities for the school picker.
    getUniversitiesRequest: {
      prepare: (payload: GetUniversitiesPayload = {}) => ({ payload }),
      reducer: () => {},
    },
    // Forgot-password step 1: send OTP to the user's identifier (email/phone).
    sendOtpForgotPassRequest: {
      prepare: (payload: SendOtpForgotPassPayload) => ({ payload }),
      reducer: () => {},
    },
    // Forgot-password step 2: verify the OTP and receive a reset token.
    verifyOtpForgotPassRequest: {
      prepare: (payload: VerifyOtpForgotPassPayload) => ({ payload }),
      reducer: () => {},
    },
    // Forgot-password step 3: submit a new password with the reset token.
    submitForgotPassRequest: {
      prepare: (payload: SubmitForgotPassPayload) => ({ payload }),
      reducer: () => {},
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
  completeRegisterRequest,
  getUniversitiesRequest,
  loginRequest,
  loginSocialRequest,
  logout,
  logoutSuccess,
  registerUserRequest,
  sendOTPRequest,
  refreshTokenRequest,
  sendOtpForgotPassRequest,
  setAccessToken,
  setCredentials,
  submitForgotPassRequest,
  verifyOTPRequest,
  verifyOtpForgotPassRequest,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
