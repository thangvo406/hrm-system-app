import type { IRequestActiveAccount, IRequestDeleteAccount } from '@type/auth';

import type {
  IRequestAutoCompleteAddress,
  IRequestUpdateMembership,
  IRequestUpdatePassword,
  IRequestUpdatePushId,
  IUpdateAvatarRequest,
  IUpdateProfileInfoRequest,
} from '@type/account';

import { httpRequest } from '@services/common/httpRequest';
import { z } from 'zod';
import { EndPoints } from '@constants';
import { IImage, IUploadFileRequest, SingleApiResponse } from '@type/common';
import { addressInstance } from '@services/common/instance';
import { CommonUtils } from '@utils';

export interface Profile {
  avatar?: IImage;
  email?: string;
  id?: string | number;
  identityNumber?: string;
  membershipAffiliationType?: string;
  membershipType?: string;
  registrationStatus?: string;
  name?: string;
  fullName?: string;
  phone?: string;
  roleCode?: string;
  universityExternalId?: string;
  universityName?: string;
  permissionCodes?: string[];
}

export const addressSuggestionSchema = z.object({
  address: z.string(),
  placeId: z.string().optional(),
});

export type AddressSuggestion = z.infer<typeof addressSuggestionSchema>;

export const getProfile = async (): Promise<Profile> => {
  const response = await httpRequest.get<SingleApiResponse<Profile>>(
    EndPoints.ACCOUNT.getProfile,
    { loading: false },
  );
  return response.data;
};

export const deleteAccount = async (
  request: IRequestDeleteAccount,
): Promise<void> => {
  await httpRequest.put(EndPoints.ACCOUNT.deleteAccount, request);
};

export const activeAccount = async (
  request: IRequestActiveAccount,
): Promise<void> => {
  await httpRequest.post(EndPoints.ACCOUNT.activeAccount, request);
};

export const updatePassword = async (
  request: IRequestUpdatePassword,
): Promise<void> => {
  await httpRequest.put(EndPoints.ACCOUNT.changePass, request);
};

export const uploadAvatar = async (
  request: IUpdateAvatarRequest,
): Promise<Profile> => {
  const response = await httpRequest.put<SingleApiResponse<Profile>>(
    EndPoints.ACCOUNT.updateProfile,
    request,
  );
  return response.data;
};

export const updateProfileInfo = async (
  request: IUpdateProfileInfoRequest,
): Promise<Profile> => {
  const response = await httpRequest.put<SingleApiResponse<Profile>>(
    EndPoints.ACCOUNT.updateProfile,
    request,
  );
  return response.data;
};

export const uploadFile = async (
  request: IUploadFileRequest,
): Promise<IImage> => {
  const formData = new FormData();
  formData.append('file', request.file);
  const response = await httpRequest.post<SingleApiResponse<IImage>>(
    EndPoints.BASE.uploadFile,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return response.data;
};

export const autoCompleteAddress = async (
  request: IRequestAutoCompleteAddress,
): Promise<AddressSuggestion[]> => {
  // const response = await httpRequest.get<SingleApiResponse<AddressSuggestion[]>>(
  //   EndPoints.ACCOUNT.autoCompleteAddress(query),
  //   { loading: false },
  // );
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await addressInstance.get(`?${params}`);
  return response.data;
};

export const updatePushId = async (
  request: IRequestUpdatePushId,
): Promise<void> => {
  await httpRequest.post(EndPoints.ACCOUNT.updatePushId, request, {
    loading: false,
  });
};
export const updateMembership = async (
  request: IRequestUpdateMembership,
): Promise<void> => {
  await httpRequest.post(EndPoints.ACCOUNT.updateMembership, request);
};

export const deletePushId = async (pushId: string): Promise<void> => {
  await httpRequest.delete(EndPoints.ACCOUNT.deletePushId(pushId), {
    loading: false,
  });
};
