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
  onFailure?: (error: string, status?: number) => void;
  onSuccess?: (data?: any) => void;
};

export type LoginPayload = {
  deviceId?: string;
  deviceName?: string;
  email: string;
  password: string;
  platform?: string;
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
    // Clears auth state. Other slices listen for this in extraReducers to
    // reset themselves, so a single dispatch wipes the whole store.
    logout: () => initialState,
    // Triggers the saga; carries the login form values.
    loginRequest: {
      prepare: (payload: LoginPayload) => ({ payload }),
      reducer: state => {
        state.error = undefined;
        state.loading = true;
      },
    },
    // Step 1 of multi-step registration.
    registerUserRequest: {
      prepare: (payload: RegisterUserPayload) => ({ payload }),
      reducer: state => {
        state.error = undefined;
        state.loading = true;
      },
    },
    // Step 2: send OTP to phone.
    sendOTPRequest: {
      prepare: (payload: SendOTPPayload) => ({ payload }),
      reducer: state => {
        state.error = undefined;
        state.loading = true;
      },
    },
    // Step 3: verify OTP.
    verifyOTPRequest: {
      prepare: (payload: VerifyOTPPayload) => ({ payload }),
      reducer: state => {
        state.error = undefined;
        state.loading = true;
      },
    },
    // Step 4: complete registration with university/membership info.
    completeRegisterRequest: {
      prepare: (payload: CompleteRegisterPayload) => ({ payload }),
      reducer: state => {
        state.error = undefined;
        state.loading = true;
      },
    },
    // Fetch the list of universities for the school picker.
    getUniversitiesRequest: {
      prepare: (payload: GetUniversitiesPayload = {}) => ({ payload }),
      reducer: state => {
        state.error = undefined;
        state.loading = true;
      },
    },
    // Forgot-password step 1: send OTP to the user's identifier (email/phone).
    sendOtpForgotPassRequest: {
      prepare: (payload: SendOtpForgotPassPayload) => ({ payload }),
      reducer: state => {
        state.error = undefined;
        state.loading = true;
      },
    },
    // Forgot-password step 2: verify the OTP and receive a reset token.
    verifyOtpForgotPassRequest: {
      prepare: (payload: VerifyOtpForgotPassPayload) => ({ payload }),
      reducer: state => {
        state.error = undefined;
        state.loading = true;
      },
    },
    // Forgot-password step 3: submit a new password with the reset token.
    submitForgotPassRequest: {
      prepare: (payload: SubmitForgotPassPayload) => ({ payload }),
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
  completeRegisterRequest,
  getUniversitiesRequest,
  loginRequest,
  logout,
  registerUserRequest,
  sendOTPRequest,
  sendOtpForgotPassRequest,
  setAccessToken,
  setCredentials,
  submitForgotPassRequest,
  verifyOTPRequest,
  verifyOtpForgotPassRequest,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
