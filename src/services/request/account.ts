import type { SingleApiResponse } from '@type/common';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { IOffice } from '@type';
// import { objectToQueryParams, removeEmptyFieldObject } from '@utils/common';

export interface Profile {
  id: string;
  companyId: number;
  username: string;
  email: string;
  phone: string;
  accountStatus: string;
  fullName: string;
  avatar: any;
  createdAt: string;
  permissionCodes: string[];
}

export const getProfile = async (): Promise<Profile> => {
  const response = await httpRequest.get<SingleApiResponse<Profile>>(
    EndPoints.ACCOUNT.getProfile,
    { loading: false },
  );
  return response.data;
};

export const getListOffice = async () // request: IRequestGetListOffice,
: Promise<IOffice[]> => {
  // const params = objectToQueryParams(removeEmptyFieldObject(request, true));
  const response = await httpRequest.get<SingleApiResponse<IOffice[]>>(
    EndPoints.ACCOUNT.listOffice,
    { loading: false },
  );
  return response.data;
};
