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
export type IResponseCompletedRegister = {
  accessToken: string;
  refreshToken: string;
};
export type IResponseRegisterSendOtp = {
  phoneVerificationToken: string;
};

export type IResponseSendOtpForgotPass = {
  phoneVerificationToken?: string;
};
export type IResponseVerifyOtpForgotPass = {
  resetToken: string;
};
export type IResponseSubmitForgotPass = {
  success?: boolean;
};
