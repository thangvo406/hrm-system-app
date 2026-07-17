import type {
  StoreCartItem,
  CheckoutInfo,
  ContributeHistoryDetail,
  ContributeSummary,
  GenerateQRCodeResponse,
  IRequestCreateOrder,
  IRequestGenerateQRCode,
  IRequestGetCartDetail,
  IRequestGetContributeHistoryDetail,
  IRequestGetDividendDetail,
  IRequestGetHistoriesDividend,
  IRequestGetInfoProductCheckout,
  IRequestGetListCart,
  IRequestGetOrderHistories,
  IRequestGetOrderHistoryDetail,
  IRequestIncreaseContribute,
  IRequestInitCharge,
  IRequestRemoveCartItem,
  IRequestUpdateCartItem,
  OrderHistoryDetailItem,
  OrderHistoryItem,
  TotalItemCart,
  CreateOrderResponse,
  CreateLinkPaymentOrderRequest,
  IKcpInitParams,
} from '@type/payment';

// Các request function nhận payload đã bị saga strip 2 callback, nên param
// dùng dạng Omit<IRequestX, 'onFailure' | 'onSuccess'>.
type WithoutCallbacks<T> = Omit<T, 'onFailure' | 'onSuccess'>;

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { CommonUtils } from '@utils';
import { ListApiResponse, SingleApiResponse } from '@type/common';
import { StoreItem } from '@hooks';
import { IDividendHistory } from '@type';

export const getInfoProductCheckout = async (
  request: WithoutCallbacks<IRequestGetInfoProductCheckout>,
): Promise<CheckoutInfo> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<SingleApiResponse<CheckoutInfo>>(
    EndPoints.PAYMENT.getInfoProductCheckout(params),
    { loading: false },
  );
  return response?.data;
};

export const removeCartItem = async (
  request: WithoutCallbacks<IRequestRemoveCartItem>,
): Promise<void> => {
  await httpRequest.delete(
    EndPoints.PAYMENT.removeCartItem(request.cartItemId),
  );
};

export const updateCartItem = async (
  request: WithoutCallbacks<IRequestUpdateCartItem>,
): Promise<StoreItem> => {
  const { cartItemId, ...body } = request;
  const response = await httpRequest.patch<SingleApiResponse<StoreItem>>(
    EndPoints.PAYMENT.updateProductCart(cartItemId),
    body,
  );
  return response.data;
};

export const getListCart = async (
  request: WithoutCallbacks<IRequestGetListCart>,
): Promise<ListApiResponse<StoreCartItem[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<StoreCartItem[]>>
  >(EndPoints.PAYMENT.getListCart(params), { loading: false });
  return response?.data;
};

export const getCartDetail = async (
  request: WithoutCallbacks<IRequestGetCartDetail>,
): Promise<StoreCartItem> => {
  const response = await httpRequest.get<SingleApiResponse<StoreCartItem>>(
    EndPoints.PAYMENT.cartDetail(request.cartId),
    { loading: false },
  );
  return response.data;
};

export const getTotalItemCart = async (): Promise<TotalItemCart> => {
  const response = await httpRequest.get<SingleApiResponse<TotalItemCart>>(
    EndPoints.PAYMENT.countTotalItemCart,
    { loading: false },
  );
  return response?.data;
};

export const createOrder = async (
  request: WithoutCallbacks<IRequestCreateOrder>,
): Promise<CreateOrderResponse> => {
  const response = await httpRequest.post<
    SingleApiResponse<CreateOrderResponse>
  >(EndPoints.PAYMENT.createOrder, request);
  return response.data;
};

export const createLinkPaymentOrder = async (
  request: CreateLinkPaymentOrderRequest,
): Promise<CreateOrderResponse> => {
  const orderId = request.orderId;
  delete request.orderId;
  const response = await httpRequest.post<
    SingleApiResponse<CreateOrderResponse>
  >(EndPoints.PAYMENT.createLinkPaymentOrder(orderId), request);
  return response.data;
};

export const getOrderHistoryDetail = async (
  request: WithoutCallbacks<IRequestGetOrderHistoryDetail>,
): Promise<OrderHistoryDetailItem> => {
  const response = await httpRequest.get<
    SingleApiResponse<OrderHistoryDetailItem>
  >(EndPoints.PAYMENT.orderHistoryDetail(request.orderId), { loading: false });
  return response.data;
};

export const getOrderHistories = async (
  request: WithoutCallbacks<IRequestGetOrderHistories>,
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
  request: WithoutCallbacks<IRequestGenerateQRCode>,
): Promise<GenerateQRCodeResponse> => {
  const response = await httpRequest.post<
    SingleApiResponse<GenerateQRCodeResponse>
  >(EndPoints.PAYMENT.generateQRCode, request);
  return response.data;
};

export const balanceCharge = async (
  request: WithoutCallbacks<IRequestInitCharge>,
): Promise<IKcpInitParams> => {
  const response = await httpRequest.post<SingleApiResponse<IKcpInitParams>>(
    EndPoints.PAYMENT.balanceCharge,
    request,
  );
  return response.data;
};

export const increaseContribution = async (
  request: WithoutCallbacks<IRequestIncreaseContribute>,
): Promise<void> => {
  await httpRequest.post(EndPoints.CONTRIBUTION.increase, request);
};

export const getContributeSummary = async (): Promise<ContributeSummary> => {
  const response = await httpRequest.get<SingleApiResponse<ContributeSummary>>(
    EndPoints.CONTRIBUTION.summary,
    { loading: false },
  );
  return response.data;
};

export const getContributeHistoryDetail = async (
  request: WithoutCallbacks<IRequestGetContributeHistoryDetail>,
): Promise<ContributeHistoryDetail> => {
  const response = await httpRequest.get<
    SingleApiResponse<ContributeHistoryDetail>
  >(EndPoints.CONTRIBUTION.historyDetail(request.historyId), {
    loading: false,
  });
  return response.data;
};

export const getDividendDetail = async (
  request: WithoutCallbacks<IRequestGetDividendDetail>,
): Promise<ContributeHistoryDetail> => {
  const response = await httpRequest.get<
    SingleApiResponse<ContributeHistoryDetail>
  >(EndPoints.CONTRIBUTION.dividendDetail(request.dividendId), {
    loading: false,
  });
  return response.data;
};

export const getHistoriesDividend = async (
  request: WithoutCallbacks<IRequestGetHistoriesDividend>,
): Promise<ListApiResponse<IDividendHistory[]>> => {
  const params = CommonUtils.objectToQueryParams(
    CommonUtils.removeEmptyFieldObject(request, true),
  );
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<IDividendHistory[]>>
  >(EndPoints.CONTRIBUTION.historiesDividend(params), { loading: false });
  return response.data;
};
