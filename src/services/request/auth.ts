import type {
  CompleteRegisterPayload,
  LoginPayload,
  RegisterUserPayload,
  SendOTPPayload,
  SendOtpForgotPassPayload,
  SubmitForgotPassPayload,
  VerifyOTPPayload,
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
} from '../../types/Auth';

import { httpRequest } from '@services/common/httpRequest';
import { z } from 'zod';
import { EndPoints } from '@constants';

type ApiResponse<T> = { data: T; content: T };

export const authResponseSchema = z.object({
  accessToken: z.string(),
  roleCode: z.string().optional(),
  refreshToken: z.string().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await httpRequest.post<ApiResponse<AuthResponse>>(
    EndPoints.AUTH.login,
    payload,
  );
  return authResponseSchema.parse(response.data);
};

export const registerUser = async (
  request: RegisterUserPayload,
): Promise<void> => {
  await httpRequest.post(EndPoints.AUTH.register, request);
};

export const sendOTP = async (
  request: SendOTPPayload,
): Promise<IResponseRegisterSendOtp> => {
  const response = await httpRequest.post<
    ApiResponse<IResponseRegisterSendOtp>
  >(EndPoints.AUTH.sendOTP, request);
  return response.data;
};

export const verifyOTP = async (
  request: VerifyOTPPayload,
): Promise<IResponseRegisterVerifyOtp> => {
  const response = await httpRequest.post<
    ApiResponse<IResponseRegisterVerifyOtp>
  >(EndPoints.AUTH.verifyOTP, request);
  return response.data;
};

export const getUniversities = async (): Promise<IResponseUniversity[]> => {
  const response = await httpRequest.get<ApiResponse<IResponseUniversity[]>>(
    EndPoints.AUTH.getUniversities,
    { loading: false },
  );
  return response.data.content;
};

export const completeRegister = async (
  request: CompleteRegisterPayload,
): Promise<IResponseCompletedRegister> => {
  const response = await httpRequest.post<
    ApiResponse<IResponseCompletedRegister>
  >(EndPoints.AUTH.completeRegister, request);
  return response.data;
};

export const sendOtpForgotPass = async (
  request: SendOtpForgotPassPayload,
): Promise<IResponseSendOtpForgotPass> => {
  const response = await httpRequest.post<
    ApiResponse<IResponseSendOtpForgotPass>
  >(EndPoints.AUTH.sendOtpForgotPass, request);
  return response.data;
};

export const verifyOtpForgotPass = async (
  request: VerifyOtpForgotPassPayload,
): Promise<IResponseVerifyOtpForgotPass> => {
  const response = await httpRequest.post<
    ApiResponse<IResponseVerifyOtpForgotPass>
  >(EndPoints.AUTH.verifyOtpForgotPass, request);
  return response.data;
};

export const submitForgotPass = async (
  request: SubmitForgotPassPayload,
): Promise<IResponseSubmitForgotPass> => {
  const response = await httpRequest.post<
    ApiResponse<IResponseSubmitForgotPass>
  >(EndPoints.AUTH.submitForgotPass, request);
  return response.data;
};
