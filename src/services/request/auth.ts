import type {
  CompleteRegisterPayload,
  LoginPayload,
  RegisterUserPayload,
  SendOTPPayload,
  SendOtpForgotPassPayload,
  SubmitForgotPassPayload,
  VerifyOTPPayload,
  LoginSocialPayload,
  VerifyOtpForgotPassPayload,
} from '@services/slices/auth/authSlice';

import type {
  IResponseRegisterVerifyOtp,
  IResponseRegisterSendOtp,
  IResponseUniversity,
  IResponseCompletedRegister,
  IResponseSendOtpForgotPass,
  IResponseSubmitForgotPass,
  IResponseVerifyOtpForgotPass,
  IResponseLoginSocial,
  LogoutRequest,
  ResponseRefreshToken,
  IResponseRegisterUser,
} from '@type/auth';
import omit from 'lodash/omit';
import { httpRequest } from '@services/common/httpRequest';
import { z } from 'zod';
import { EndPoints } from '@constants';
import { SingleApiResponse } from '@type/common';

export const authResponseSchema = z.object({
  accessToken: z.string(),
  roleCode: z.string().optional(),
  refreshToken: z.string().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await httpRequest.post<SingleApiResponse<AuthResponse>>(
    EndPoints.AUTH.login,
    payload,
  );
  return authResponseSchema.parse(response.data);
};

export const registerUser = async (
  request: RegisterUserPayload,
): Promise<IResponseRegisterUser> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseRegisterUser>
  >(EndPoints.AUTH.register, request);
  return response.data;
};

export const sendOTP = async (
  request: SendOTPPayload,
): Promise<IResponseRegisterSendOtp> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseRegisterSendOtp>
  >(EndPoints.AUTH.sendOTP, request);
  return response.data;
};

export const verifyOTP = async (
  request: VerifyOTPPayload,
): Promise<IResponseRegisterVerifyOtp> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseRegisterVerifyOtp>
  >(EndPoints.AUTH.verifyOTP, request);
  return response.data;
};

export const getUniversities = async (): Promise<IResponseUniversity[]> => {
  const response = await httpRequest.get<
    SingleApiResponse<IResponseUniversity[]>
  >(EndPoints.AUTH.getUniversities, { loading: false });
  return response.data.content;
};

export const loginSocial = async (
  request: LoginSocialPayload,
): Promise<IResponseLoginSocial> => {
  const _request = omit(request, ['provider']);
  const response = await httpRequest.post<
    SingleApiResponse<IResponseLoginSocial>
  >(EndPoints.AUTH.loginSocial(request.provider), _request);
  return response.data;
};

export const completeRegister = async (
  request: CompleteRegisterPayload,
): Promise<IResponseCompletedRegister> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseCompletedRegister>
  >(EndPoints.AUTH.completeRegister, request);
  return response.data;
};

export const sendOtpForgotPass = async (
  request: SendOtpForgotPassPayload,
): Promise<IResponseSendOtpForgotPass> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseSendOtpForgotPass>
  >(EndPoints.AUTH.sendOtpForgotPass, request);
  return response.data;
};

export const refreshToken = async (
  refreshTokenString: string,
): Promise<ResponseRefreshToken> => {
  const response = await httpRequest.post<
    SingleApiResponse<ResponseRefreshToken>
  >(
    EndPoints.AUTH.refreshToken,
    {
      refreshToken: refreshTokenString,
    },
    {
      loading: false,
    },
  );
  return response.data;
};

export const verifyOtpForgotPass = async (
  request: VerifyOtpForgotPassPayload,
): Promise<IResponseVerifyOtpForgotPass> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseVerifyOtpForgotPass>
  >(EndPoints.AUTH.verifyOtpForgotPass, request);
  return response.data;
};

export const submitForgotPass = async (
  request: SubmitForgotPassPayload,
): Promise<IResponseSubmitForgotPass> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseSubmitForgotPass>
  >(EndPoints.AUTH.submitForgotPass, request);
  return response.data;
};

export const logout = async (request: LogoutRequest): Promise<void> => {
  await httpRequest.post(EndPoints.AUTH.logout, request);
};
