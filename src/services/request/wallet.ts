import type { Wallet, IRequestGetTransactionHistories } from '@type/wallet';
import type { IRequestTopUpWallet } from '@type/wallet';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { SingleApiResponse } from '@type/common';
import { CommonUtils } from '@utils';

export const getCurrentWallet = async (): Promise<Wallet> => {
  const response = await httpRequest.get<SingleApiResponse<Wallet>>(
    EndPoints.WALLET.currentWallet,
    { loading: false },
  );
  return response?.data;
};

export const getTransactionHistories = async (
  request: IRequestGetTransactionHistories,
): Promise<Wallet> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<SingleApiResponse<Wallet>>(
    EndPoints.WALLET.getTransactionHistories(params),
    { loading: false },
  );
  return response?.data;
};

export const topUpWallet = async (
  request: IRequestTopUpWallet,
): Promise<Wallet> => {
  const response = await httpRequest.post<SingleApiResponse<Wallet>>(
    EndPoints.WALLET.topUpWallet,
    request,
  );
  return response?.data;
};
