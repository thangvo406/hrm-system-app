import type {
  IConfirmMembershipVerification,
  IRequestActiveAccount,
  IRequestDeleteAccount,
  IResponseConfirmMemberShipVerify,
  IResponseSendOtpVerifyMembership,
} from '@type/auth';

import type {
  IResponseOrganizationInfo,
  IRequestAutoCompleteAddress,
  IRequestGenerateQRCodeMealTicket,
  IRequestGetPayPointHistories,
  IRequestGetVouchers,
  IRequestUpdateMembership,
  IRequestUpdatePassword,
  IRequestUpdatePushId,
  IRequestWithdrawalBalance,
  IUpdateAvatarRequest,
  IUpdateProfileInfoRequest,
  IRequestCreateQRCodeMember,
  IRequestGetTransactionDetail,
  IRequestGetTransactionMovement,
  ITransactionMovement,
  IVoucher,
  IMealTicket,
  IPointPayHistory,
  IGenerateQRCodeResponse,
} from '@type/account';
import type { ITransactionDetail } from '@type/payment';

import { httpRequest } from '@services/common/httpRequest';
import { z } from 'zod';
import { EndPoints } from '@constants';
import {
  IImage,
  IUploadFileRequest,
  ListApiResponse,
  SingleApiResponse,
} from '@type/common';
import { addressInstance } from '@services/common/instance';
import { CommonUtils } from '@utils';

export interface Profile {
  avatar?: IImage;
  coopMemberGrade?: string;
  membershipStatus?: string;
  email?: string;
  id?: string | number;
  identityNumber?: string;
  membershipAffiliationType?: string;
  membershipType?: string;
  universityId?: number;
  registrationStatus?: string;
  name?: string;
  fullName?: string;
  phone?: string;
  receiptPhoneNumber?: string;
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

export const getOrganizationInfo =
  async (): Promise<IResponseOrganizationInfo> => {
    const response = await httpRequest.get<
      SingleApiResponse<IResponseOrganizationInfo>
    >(EndPoints.ACCOUNT.getOrganizationInfo, { loading: false });
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

export const getPayPointHistories = async (
  request: Omit<IRequestGetPayPointHistories, 'onFailure' | 'onSuccess'>,
): Promise<ListApiResponse<IPointPayHistory[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<IPointPayHistory[]>>
  >(EndPoints.ACCOUNT.payPointHistories(params ? `?${params}` : ''), {
    loading: false,
  });
  return response.data;
};

export const withdrawalBalance = async (
  request: Omit<IRequestWithdrawalBalance, 'onFailure' | 'onSuccess'>,
): Promise<void> => {
  await httpRequest.post(EndPoints.ACCOUNT.withdrawalBalance, request);
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
): Promise<IResponseSendOtpVerifyMembership> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseSendOtpVerifyMembership>
  >(EndPoints.ACCOUNT.updateMembership, request);
  return response.data;
};

export const confirmOTPRequestMembership = async (
  request: IConfirmMembershipVerification,
): Promise<IResponseConfirmMemberShipVerify> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseConfirmMemberShipVerify>
  >(EndPoints.ACCOUNT.confirmOTPRequestMembership, request);
  return response.data;
};

export const deletePushId = async (pushId: string): Promise<void> => {
  await httpRequest.delete(EndPoints.ACCOUNT.deletePushId(pushId), {
    loading: false,
  });
};

export const createQRCodeMember = async (
  request: IRequestCreateQRCodeMember,
): Promise<IGenerateQRCodeResponse> => {
  const response = await httpRequest.post<
    SingleApiResponse<IGenerateQRCodeResponse>
  >(EndPoints.ACCOUNT.createQRCodeMember, request);
  return response.data;
};

export const getVouchers = async (
  request: Omit<IRequestGetVouchers, 'onFailure' | 'onSuccess'>,
): Promise<ListApiResponse<IVoucher[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<IVoucher[]>>
  >(EndPoints.VOUCHERS.list(params ? `?${params}` : ''), { loading: false });
  return response.data;
};

export const getTransactionsMovement = async (
  request: Omit<IRequestGetTransactionMovement, 'onFailure' | 'onSuccess'>,
): Promise<ListApiResponse<ITransactionMovement[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<ITransactionMovement[]>>
  >(EndPoints.ACCOUNT.getTransactionsMovement(params ? `?${params}` : ''), {
    loading: false,
  });
  return response.data;
};

export const getTransactionDetail = async (
  request: Omit<IRequestGetTransactionDetail, 'onFailure' | 'onSuccess'>,
): Promise<ITransactionDetail> => {
  const response = await httpRequest.get<SingleApiResponse<ITransactionDetail>>(
    EndPoints.ACCOUNT.transactionDetail(request.transactionId),
    { loading: false },
  );
  return response.data;
};

export const getMealTickets = async (
  request: Omit<IRequestGetVouchers, 'onFailure' | 'onSuccess'>,
): Promise<ListApiResponse<IMealTicket[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<IMealTicket[]>>
  >(EndPoints.ACCOUNT.getMealTickets(params ? `?${params}` : ''), {
    loading: false,
  });
  return response.data;
};

export const generateQRCodeMealTicket = async (
  request: Omit<IRequestGenerateQRCodeMealTicket, 'onFailure' | 'onSuccess'>,
): Promise<IGenerateQRCodeResponse> => {
  const response = await httpRequest.post<
    SingleApiResponse<IGenerateQRCodeResponse>
  >(EndPoints.ACCOUNT.generateQRCodeMealTicket, request);
  return response.data;
};
