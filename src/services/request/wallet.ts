import type {
  IWallet,
  IContributeHistory,
  IRequestGetTransactionHistories,
} from '@type/wallet';
import type { IRequestTopUpWallet } from '@type/wallet';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { ListApiResponse, SingleApiResponse } from '@type/common';
import { CommonUtils } from '@utils';

export const getCurrentWallet = async (): Promise<IWallet> => {
  const response = await httpRequest.get<SingleApiResponse<IWallet>>(
    EndPoints.WALLET.currentWallet,
    { loading: false },
  );
  return response?.data;
};

export const getContributeHistories = async (
  request: IRequestGetTransactionHistories,
): Promise<ListApiResponse<IContributeHistory[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<IContributeHistory[]>>
  >(EndPoints.CONTRIBUTION.histories(params), { loading: false });
  return response?.data;
};

export const topUpWallet = async (
  request: IRequestTopUpWallet,
): Promise<IWallet> => {
  const response = await httpRequest.post<SingleApiResponse<IWallet>>(
    EndPoints.WALLET.topUpWallet,
    request,
  );
  return response?.data;
};
