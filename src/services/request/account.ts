import type { IRequestUpdatePushId } from '@type/account';
import type { IImage, SingleApiResponse } from '@type/common';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';

export interface Profile {
  avatar?: IImage;
  email?: string;
  fullName?: string;
  id?: string | number;
  identityNumber?: string;
  name?: string;
  permissionCodes?: string[];
  phone?: string;
  roleCode?: string;
}

export const getProfile = async (): Promise<Profile> => {
  const response = await httpRequest.get<SingleApiResponse<Profile>>(
    EndPoints.ACCOUNT.getProfile,
    { loading: false },
  );
  return response.data;
};

export const updatePushId = async (
  request: IRequestUpdatePushId,
): Promise<void> => {
  await httpRequest.post(EndPoints.ACCOUNT.updatePushId, request, {
    loading: false,
  });
};

export const deletePushId = async (pushId: string): Promise<void> => {
  await httpRequest.delete(EndPoints.ACCOUNT.deletePushId(pushId), {
    loading: false,
  });
};
