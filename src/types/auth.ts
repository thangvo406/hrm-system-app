import type { AppCallback, IImage, ListApiResponse } from './common';

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

export type AuthStep =
  | 'verify_info_failed'
  | 'choose_membership'
  | 'input_academic_email'
  | 'academic_verification'
  | 'academic_verification_completed'
  | 'choose_role'
  | 'form'
  | 'bank_information'
  | 'verified_info'
  | 'register_input'
  | 'choose_school';

export type RegisterMembershipStep =
  | 'choose_school'
  | 'choose_membership'
  | 'input_academic_email'
  | 'academic_verification'
  | 'academic_verification_completed'
  | 'register_completed';

export interface ISelectSchoolRequest extends AppCallback {
  universityId: number;
}

export interface ISelectSchoolSuccessPayload {
  universityId: number;
}

export interface ISetUniversitiesPayload {
  content: IResponseUniversity[];
  last: boolean;
  page: number;
}

export interface IUniversityData {
  content: IResponseUniversity[];
  isLast: boolean;
  page: number;
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
export interface IResponseCreateLinkVerifyInfoUser {
  callUrl: string;
  regCertKey: string;
  ordrIdxx: string;
  certWebViewUrl: string;
}
export interface IRequestCreateLinkVerifyInfoUser
  extends AppCallback<IResponseCreateLinkVerifyInfoUser> {
  registerToken: string;
}
export interface IResponseRegisterUser {
  registerToken: string;
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

export interface IRequestLogin extends AppCallback<IResponseLogin> {
  email: string;
  password: string;
}

export interface IRequestLoginSocial extends AppCallback<IResponseLogin> {
  accessToken?: string;
  authorizationCode?: string;
  codeVerifier?: string;
  idToken?: string;
  provider: 'GOOGLE' | 'KAKAO' | 'NAVER';
  redirectUri?: string;
  state?: string;
}

export interface IRequestRegisterUser
  extends AppCallback<IResponseRegisterUser> {
  email: string;
  name: string;
  password: string;
}

export interface IRequestSendOTP extends AppCallback<IResponseRegisterSendOtp> {
  registerToken: string;
  phone: string;
}

export interface IRequestVerifyOTP
  extends AppCallback<IResponseRegisterVerifyOtp> {
  phoneVerificationToken?: string;
  phone: string;
  identityNumber: string;
  otp: string;
  termsAgreed: boolean;
}

export interface IRequestGetUniversities
  extends AppCallback<ListApiResponse<IResponseUniversity[]>> {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface IRequestSendOtpForgotPass
  extends AppCallback<IResponseSendOtpForgotPass> {
  identifier: string;
}

export interface IRequestVerifyOtpForgotPass
  extends AppCallback<IResponseVerifyOtpForgotPass> {
  email: string;
  identityNumber: string;
  otp: string;
  phone: string;
  fullName: string;
  phoneVerificationToken: string;
  termsAgreed: boolean;
}

export interface IRequestSubmitForgotPass
  extends AppCallback<IResponseSubmitForgotPass> {
  confirmPassword: string;
  newPassword: string;
  resetToken: string;
}

export interface IRequestSendOtpVerifyMembership
  extends AppCallback<IResponseSendOtpVerifyMembership> {
  membershipType?: string;
  signupToken?: string;
  universityId?: number;
  universityEmail?: string;
}

export interface IRequestConfirmMemberShipVerify
  extends AppCallback<IResponseConfirmMemberShipVerify>,
    IConfirmMembershipVerification {}

export interface IRequestDeleteAccount extends AppCallback {
  deletedReason: string;
}
// TODO: define request fields when the reactivation API spec is available.
export type IRequestActiveAccount = Record<string, never>;
