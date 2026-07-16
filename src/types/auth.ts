import { IImage } from './common';

export interface AuthCallback {
  onFailure?: (error: string, status?: number) => void;
  onSuccess?: (data?: any) => void;
}

export interface IResponseUniversity {
  id: number;
  name: string;
  address: string;
  logo: IImage;
  code: string;
}
export interface IResponseRegisterVerifyOtp {
  signupToken: string;
}

export interface ISelectSchoolRequest extends AuthCallback {
  universityId: number;
}

export interface ISelectSchoolSuccessPayload {
  universityId: number;
}

export interface ICredentials {
  accessToken: string;
  refreshToken?: string;
}

export interface IConfirmMembershipVerification {
  otp: string;
  universityEmail: string;
  emailVerificationToken: string;
}
export interface IResponseRefreshToken {
  accessToken: string;
  refreshToken?: string;
}

export interface IResponseRegisterUser {
  phoneVerificationToken: string;
}
export interface IResponseRegisterSendOtp {
  phoneVerificationToken: string;
}

export interface IResponseSendOtpForgotPass {
  phoneVerificationToken?: string;
}
export interface LogoutRequest {
  refreshToken: string;
}
// TODO: define response fields when the social-login API spec is available.
export type IResponseLoginSocial = Record<string, never>;
export interface IResponseVerifyOtpForgotPass {
  resetToken: string;
}
export interface IResponseLogin {
  accessToken: string;
  membershipType: string;
  membershipStatus: string;
  refreshToken: string;
  archivedInformation: string;
  dormantDate: string;
  lastLoginDate: string;
  expiredInformation: string;
  accountStatus: string;
}
export interface IResponseConfirmMemberShipVerify {
  registrationStatus: string;
  membershipType: string;
  membershipStatus: string;
  universityId: number;
  universityName: string;
  universityEmail: string;
  emailVerificationRequired: boolean;
  emailVerificationExpiresIn: number;
  resendAfterMs: number;
}
export interface IResponseSendOtpVerifyMembership {
  emailVerificationToken: string;
}
export interface IResponseSubmitForgotPass {
  success?: boolean;
}

export interface IRequestLogin extends AuthCallback {
  email: string;
  password: string;
}

export interface IRequestLoginSocial extends AuthCallback {
  accessToken?: string;
  authorizationCode?: string;
  codeVerifier?: string;
  idToken?: string;
  provider: 'GOOGLE' | 'KAKAO' | 'NAVER';
  redirectUri?: string;
  state?: string;
}

export interface IRequestRegisterUser extends AuthCallback {
  email: string;
  name: string;
  password: string;
}

export interface IRequestSendOTP extends AuthCallback {
  registerToken: string;
  phone: string;
}

export interface IRequestVerifyOTP extends AuthCallback {
  phoneVerificationToken?: string;
  phone: string;
  identityNumber: string;
  otp: string;
  termsAgreed: boolean;
}

export interface IRequestGetUniversities extends AuthCallback {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface IRequestSendOtpForgotPass extends AuthCallback {
  identifier: string;
}

export interface IRequestVerifyOtpForgotPass extends AuthCallback {
  email: string;
  identityNumber: string;
  otp: string;
  phone: string;
  fullName: string;
  phoneVerificationToken: string;
  termsAgreed: boolean;
}

export interface IRequestSubmitForgotPass extends AuthCallback {
  confirmPassword: string;
  newPassword: string;
  resetToken: string;
}

export interface IRequestSendOtpVerifyMembership extends AuthCallback {
  membershipType?: string;
  signupToken?: string;
  universityId?: number;
  universityEmail?: string;
}

export interface IRequestConfirmMemberShipVerify
  extends AuthCallback,
    IConfirmMembershipVerification {}

export interface IRequestDeleteAccount extends AuthCallback {
  deletedReason: string;
}
// TODO: define request fields when the reactivation API spec is available.
export type IRequestActiveAccount = Record<string, never>;
