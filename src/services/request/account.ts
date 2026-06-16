import { httpRequest } from '@services/common/httpRequest';
import { z } from 'zod';
import { EndPoints } from '@constants';

type ApiResponse<T> = { data: T };

export const profileSchema = z.object({
  avatar: z.string().optional(),
  email: z.string().optional(),
  id: z.union([z.string(), z.number()]).optional(),
  identityNumber: z.string().optional(),
  membershipAffiliationType: z.string().optional(),
  membershipType: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  roleCode: z.string().optional(),
  universityExternalId: z.string().optional(),
  universityName: z.string().optional(),
});

export type Profile = z.infer<typeof profileSchema>;

export const getProfile = async (): Promise<Profile> => {
  const response = await httpRequest.get<ApiResponse<Profile>>(
    EndPoints.ACCOUNT.getProfile,
    { loading: false },
  );
  return response.data;
};
