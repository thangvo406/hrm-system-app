import type { IAccount, IRequestAddAccount } from '@type/accountManagement';
import type { IRequestLockCard, IRequestRemoveCard } from '@type/wallet';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { SingleApiResponse } from '@type/common';
import { IKcpInitParams } from '@type';

export const addAccount = async (
  request: IRequestAddAccount,
): Promise<IKcpInitParams> => {
  const response = await httpRequest.post<SingleApiResponse<IKcpInitParams>>(
    EndPoints.ACCOUNT_MANAGEMENT.addAccount,
    request,
  );
  return response.data;
};

export const getAccountCards = async (): Promise<IAccount[]> => {
  const response = await httpRequest.get<SingleApiResponse<IAccount[]>>(
    EndPoints.ACCOUNT_MANAGEMENT.list,
    { loading: false },
  );
  return response.data;
};

export const lockCardAccount = async (
  request: IRequestLockCard,
): Promise<boolean> => {
  const response = await httpRequest.post<SingleApiResponse<boolean>>(
    EndPoints.ACCOUNT_MANAGEMENT.lockCardAccount,
    request,
  );
  return response.data;
};

export const unLockCardAccount = async (
  request: IRequestLockCard,
): Promise<boolean> => {
  const response = await httpRequest.post<SingleApiResponse<boolean>>(
    EndPoints.ACCOUNT_MANAGEMENT.unLockCardAccount,
    request,
  );
  return response.data;
};

export const removeCardAccount = async (
  request: IRequestRemoveCard,
): Promise<IKcpInitParams> => {
  const response = await httpRequest.post<SingleApiResponse<IKcpInitParams>>(
    EndPoints.ACCOUNT_MANAGEMENT.removeCardAccount,
    request,
  );
  return response.data;
};

export const makeDefaultCardAccount = async (
  request: IRequestRemoveCard,
): Promise<boolean> => {
  const response = await httpRequest.post<SingleApiResponse<boolean>>(
    EndPoints.ACCOUNT_MANAGEMENT.makeDefaultCard,
    request,
  );
  return response.data;
};
