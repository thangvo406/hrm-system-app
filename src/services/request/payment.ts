import type {
  StoreCartItem,
  CheckoutInfo,
  CreateOrderPayload,
  GenerateQRCodeRequest,
  GenerateQRCodeResponse,
  GetInfoProductCheckoutPayload,
  GetListCartPayload,
  GetOrderHistoriesRequest,
  GetOrderHistoryDetailRequest,
  OrderHistoryDetailItem,
  OrderHistoryItem,
  RemoveCartItemPayload,
  TotalItemCart,
  UpdateCartItemPayload,
  CreateOrderResponse,
} from '@type/payment';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { CommonUtils } from '@utils';
import { ListApiResponse, SingleApiResponse } from '@type/common';
import { StoreItem } from '@hooks';

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
): Promise<StoreItem> => {
  const { cartItemId, ...body } = request;
  const response = await httpRequest.patch<SingleApiResponse<StoreItem>>(
    EndPoints.PAYMENT.updateProductCart(cartItemId),
    body,
  );
  return response.data;
};

type GetListCartRequest = Omit<GetListCartPayload, 'onFailure' | 'onSuccess'>;

export const getListCart = async (
  request: GetListCartRequest,
): Promise<ListApiResponse<StoreCartItem[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<StoreCartItem[]>>
  >(EndPoints.PAYMENT.getListCart(params), { loading: false });
  return response?.data;
};

export const getTotalItemCart = async (): Promise<TotalItemCart> => {
  const response = await httpRequest.get<SingleApiResponse<TotalItemCart>>(
    EndPoints.PAYMENT.countTotalItemCart,
    { loading: false },
  );
  return response?.data;
};

type CreateOrderRequestBody = Omit<
  CreateOrderPayload,
  'onFailure' | 'onSuccess'
>;

export const createOrder = async (
  request: CreateOrderRequestBody,
): Promise<CreateOrderResponse> => {
  const response = await httpRequest.post<
    SingleApiResponse<CreateOrderResponse>
  >(EndPoints.PAYMENT.createOrder, request);
  return response.data;
};

export const getOrderHistoryDetail = async (
  request: GetOrderHistoryDetailRequest,
): Promise<OrderHistoryDetailItem> => {
  const response = await httpRequest.get<
    SingleApiResponse<OrderHistoryDetailItem>
  >(EndPoints.PAYMENT.orderHistoryDetail(request.orderId), { loading: false });
  return response.data;
};

export const getOrderHistories = async (
  request: GetOrderHistoriesRequest,
): Promise<ListApiResponse<OrderHistoryItem[]>> => {
  const params = CommonUtils.objectToQueryParams(
    CommonUtils.removeEmptyFieldObject(request, true),
  );
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<OrderHistoryItem[]>>
  >(EndPoints.PAYMENT.orderHistories(params), { loading: false });
  return response.data;
};

export const getAddressOrderRecent = async (): Promise<string[]> => {
  const response = await httpRequest.get<SingleApiResponse<string[]>>(
    EndPoints.PAYMENT.addressOrderRecent,
    { loading: false },
  );
  return response.data;
};

export const generateQRCode = async (
  request: GenerateQRCodeRequest,
): Promise<GenerateQRCodeResponse> => {
  const response = await httpRequest.post<SingleApiResponse<GenerateQRCodeResponse>>(
    EndPoints.PAYMENT.generateQRCode,
    request,
  );
  return response.data;
};
