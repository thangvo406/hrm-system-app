import type {
  IRequestLogin,
  IResponseLogin,
  IResponseRefreshToken,
  LogoutRequest,
} from '@type/auth';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { SingleApiResponse } from '@type/common';

export const login = async (
  payload: IRequestLogin,
): Promise<IResponseLogin> => {
  const response = await httpRequest.post<SingleApiResponse<IResponseLogin>>(
    EndPoints.AUTH.login,
    payload,
  );
  return response.data;
};

export const refreshToken = async (
  refreshTokenString: string,
): Promise<IResponseRefreshToken> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseRefreshToken>
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

export const logout = async (request: LogoutRequest): Promise<void> => {
  await httpRequest.post(EndPoints.AUTH.logout, request, { loading: false });
};
