import type {
  CheckoutInfo,
  GetInfoProductCheckoutPayload,
  RemoveCartItemPayload,
} from '@type/payment';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { CommonUtils } from '@utils';
import { SingleApiResponse } from '@type/common';

type GetInfoProductCheckoutRequest = Omit<
  GetInfoProductCheckoutPayload,
  'onFailure' | 'onSuccess'
>;

export const getInfoProductCheckout = async (
  request: GetInfoProductCheckoutRequest,
): Promise<CheckoutInfo> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<SingleApiResponse<CheckoutInfo>>(
    EndPoints.PAYMENT.getInfoProductCheckout(params),
    { loading: false },
  );
  return response?.data;
};

type RemoveCartItemRequest = Omit<
  RemoveCartItemPayload,
  'onFailure' | 'onSuccess'
>;

export const removeCartItem = async (
  request: RemoveCartItemRequest,
): Promise<void> => {
  await httpRequest.delete(
    EndPoints.PAYMENT.removeCartItem(request.cartItemId),
  );
};
