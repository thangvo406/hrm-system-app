import type { Wallet } from '@type/wallet';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { SingleApiResponse } from '@type/common';

export const getCurrentWallet = async (): Promise<Wallet> => {
  const response = await httpRequest.get<SingleApiResponse<Wallet>>(
    EndPoints.WALLET.currentWallet,
    { loading: false },
  );
  return response?.data;
};
