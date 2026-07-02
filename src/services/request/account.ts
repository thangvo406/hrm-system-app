import { httpRequest } from '@services/common/httpRequest';
import { z } from 'zod';
import { EndPoints } from '@constants';
import { UpdatePushIdPayload } from '@services/slices/account/accountSlice';
import { SingleApiResponse } from '@type/common';
import { addressInstance } from '@services/common/instance';
import { CommonUtils } from '@utils';

export const profileSchema = z.object({
  avatar: z.string().optional(),
  email: z.string().optional(),
  id: z.union([z.string(), z.number()]).optional(),
  identityNumber: z.string().optional(),
  membershipAffiliationType: z.string().optional(),
  membershipType: z.string().optional(),
  registrationStatus: z.string().optional(),
  name: z.string().optional(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  roleCode: z.string().optional(),
  universityExternalId: z.string().optional(),
  universityName: z.string().optional(),
  permissionCodes: z.array(z.string()).optional(),
});

export type Profile = z.infer<typeof profileSchema>;

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

export const autoCompleteAddress = async (
  request: any,
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
  request: UpdatePushIdPayload,
): Promise<void> => {
  await httpRequest.post(EndPoints.ACCOUNT.updatePushId, request, {
    loading: false,
  });
};
export const updateMembership = async (request: {
  membershipType: string;
}): Promise<void> => {
  await httpRequest.post(EndPoints.ACCOUNT.updateMembership, request);
};

export const deletePushId = async (pushId: string): Promise<void> => {
  await httpRequest.delete(EndPoints.ACCOUNT.deletePushId(pushId), {
    loading: false,
  });
};
