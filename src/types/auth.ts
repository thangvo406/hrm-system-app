import { AppCallback } from './common';

export type IResponseUniversity = {
  id: string;
  name: string;
  address: string;
  logoUrl: string;
  code: string;
};
export type IResponseRegisterVerifyOtp = {
  signupToken: string;
};

export type resendVerifyAcademicMailRequest = {
  signupToken: string;
} & AppCallback;

export type MemberShipVerifyRequest = {
  signupToken: string;
  membershipType: string;
  universityEmail: string;
} & AppCallback;

export type ResponseRefreshToken = {
  accessToken: string;
  refreshToken?: string;
};

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
export type IResponseSubmitForgotPass = {
  success?: boolean;
};
