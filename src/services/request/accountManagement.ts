import type { IAccount, IRequestAddAccount } from '@type/accountManagement';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { SingleApiResponse } from '@type/common';
import { CommonUtils } from '@utils';
import { IKcpInitParams } from '@type';

export const addAccount = async (
  request: IRequestAddAccount,
): Promise<IKcpInitParams> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.post<SingleApiResponse<IKcpInitParams>>(
    EndPoints.ACCOUNT_MANAGEMENT.addAccount(params),
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
