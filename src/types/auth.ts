import { AppCallback } from './common';

export type IResponseUniversity = {
  id: number;
  name: string;
  address: string;
  logoUrl: string;
  code: string;
};
export type IResponseRegisterVerifyOtp = {
  signupToken: string;
};

export type ISelectSchoolRequest = {
  universityId: number;
} & AppCallback;

export interface IConfirmMembershipVerification {
  otp: string;
  universityEmail: string;
  emailVerificationToken: string;
}
export interface IResponseRefreshToken {
  accessToken: string;
  refreshToken?: string;
}

export type IResponseRegisterUser = {
  phoneVerificationToken: string;
};
export type IResponseRegisterSendOtp = {
  phoneVerificationToken: string;
};

export type IResponseSendOtpForgotPass = {
  phoneVerificationToken?: string;
};
export type LogoutRequest = {
  refreshToken: string;
};
export type IResponseLoginSocial = {
  //TODO: define response
};
export type IResponseVerifyOtpForgotPass = {
  resetToken: string;
};
export type IResponseConfirmMemberShipVerify = {
  registrationStatus: string;
  membershipType: string;
  membershipStatus: string;
  universityId: number;
  universityName: string;
  universityEmail: string;
  emailVerificationRequired: boolean;
  emailVerificationExpiresIn: number;
  resendAfterMs: number;
};
export type IResponseSendOtpVerifyMembership = {
  emailVerificationToken: string;
};
export type IResponseSubmitForgotPass = {
  success?: boolean;
};
