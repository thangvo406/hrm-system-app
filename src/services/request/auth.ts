import type {
  CompleteRegisterPayload,
  LoginPayload,
  RegisterUserPayload,
  SendOTPPayload,
  VerifyOTPPayload,
} from '@services/slices/auth/authSlice';

import { httpRequest } from '@services/common/httpRequest';
import { z } from 'zod';
import { EndPoints } from '@services/common/endPoint';

type ApiResponse<T> = { data: T };

export const authResponseSchema = z.object({
  accessToken: z.string(),
  roleCode: z.string().optional(),
  refreshToken: z.string().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await httpRequest.post<ApiResponse<AuthResponse>>(
    'http://172.8.154.79:3000/' + EndPoints.AUTH.login,
    payload,
  );
  return authResponseSchema.parse(response.data);
};

export const register = async (
  payload: RegisterUserPayload,
): Promise<AuthResponse> => {
  const response = await httpRequest.post<ApiResponse<AuthResponse>>(
    EndPoints.AUTH.register,
    payload,
  );
  return authResponseSchema.parse(response.data);
};

export const registerUser = async (
  request: RegisterUserPayload,
): Promise<void> => {
  await httpRequest.post(EndPoints.AUTH.register, request);
};

export const sendOTP = async (request: SendOTPPayload): Promise<void> => {
  const response = await httpRequest.post(EndPoints.AUTH.sendOTP, request);
  console.log('response', response);
  return response;
};

export const verifyOTP = async (request: VerifyOTPPayload): Promise<void> => {
  const response = await httpRequest.post(EndPoints.AUTH.verifyOTP, request);
  console.log('response', response);
  return response;
};

export const completeRegister = async (
  request: CompleteRegisterPayload,
): Promise<void> => {
  const response = await httpRequest.post(
    EndPoints.AUTH.completeRegister,
    request,
  );
  return response.data;
};
