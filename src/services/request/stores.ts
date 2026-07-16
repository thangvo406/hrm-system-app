import type {
  IRequestGetStoreDetail,
  IRequestGetStores,
  StoreItem,
} from '@type/store';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { ListApiResponse, SingleApiResponse } from '@type/common';
import { CommonUtils } from '@utils';

export const getStores = async (
  request: IRequestGetStores,
): Promise<ListApiResponse<StoreItem[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<StoreItem[]>>
  >(EndPoints.STORE.list(params), { loading: false });
  return response.data;
};

export const getStoreDetail = async (
  request: IRequestGetStoreDetail,
): Promise<StoreItem> => {
  const response = await httpRequest.get<SingleApiResponse<StoreItem>>(
    EndPoints.STORE.detail(request.storeId),
    { loading: false },
  );
  return response.data;
};

export const getStoreOrderRecent = async (): Promise<StoreItem> => {
  const response = await httpRequest.get<SingleApiResponse<StoreItem>>(
    EndPoints.STORE.storeOrderRecent,
    { loading: false },
  );
  return response.data;
};
