import type { SingleApiResponse } from '@type/common';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';

export interface Profile {
  id: string;
  username: string;
  email: string;
  phone: string;
  accountStatus: string;
  fullName: string;
  avatar: any;
  createdAt: string;
}

export const getProfile = async (): Promise<Profile> => {
  const response = await httpRequest.get<SingleApiResponse<Profile>>(
    EndPoints.ACCOUNT.getProfile,
    { loading: false },
  );
  return response.data;
};
