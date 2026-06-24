import type {
  CartItem,
  CheckoutInfo,
  GetInfoProductCheckoutPayload,
  GetListCartPayload,
  RemoveCartItemPayload,
  UpdateCartItemPayload,
} from '@type/payment';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { CommonUtils } from '@utils';
import { ListApiResponse, SingleApiResponse } from '@type/common';

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

type UpdateCartItemRequest = Omit<
  UpdateCartItemPayload,
  'onFailure' | 'onSuccess'
>;

export const updateCartItem = async (
  request: UpdateCartItemRequest,
): Promise<void> => {
  const { cartItemId, ...body } = request;
  await httpRequest.patch(
    EndPoints.PAYMENT.updateProductCart(cartItemId),
    body,
  );
};

type GetListCartRequest = Omit<GetListCartPayload, 'onFailure' | 'onSuccess'>;

export const getListCart = async (
  request: GetListCartRequest,
): Promise<ListApiResponse<CartItem[]>> => {
  const params = CommonUtils.objectToQueryParams(request);
  return httpRequest.get<ListApiResponse<CartItem[]>>(
    EndPoints.PAYMENT.getListCart(params),
  );
};
