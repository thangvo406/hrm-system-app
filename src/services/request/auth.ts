import type {
  LoginPayload,
  RegisterPayload,
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
  const response = await httpRequest.post<ApiResponse<AuthResponse>>(EndPoints.AUTH.login, payload);
  return authResponseSchema.parse(response.data);
};

export const register = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await httpRequest.post<ApiResponse<AuthResponse>>('auth/register', payload);
  return authResponseSchema.parse(response.data);
};
