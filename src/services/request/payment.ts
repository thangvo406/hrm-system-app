import type {
  IStoreCartItem,
  ICheckoutInfo,
  IRequestCancelOrder,
  IRequestCreateOrder,
  IRequestGenerateQRCode,
  IRequestGetCartDetail,
  IRequestGetInfoProductCheckout,
  IRequestGetListCart,
  IRequestGetOrderHistories,
  IRequestGetOrderHistoryDetail,
  IRequestDecreaseContribute,
  IRequestInitCharge,
  IRequestRemoveCartItem,
  IRequestUpdateCartItem,
  IOrderHistoryDetailItem,
  IOrderHistoryItem,
  IPriceDetail,
  IRequestCalculatePrice,
  ITotalItemCart,
  ICreateOrderResponse,
  ICreateLinkPaymentOrderRequest,
  IKcpInitParams,
  IResponseInitPayment,
  IRequestGenerateQRRefundTransaction,
  IRequestReOrder,
} from '@type/payment';

import { IGenerateQRCodeResponse } from '@type/account';

import {
  IResponseIncreaseContribute,
  IRequestIncreaseContribute,
  IContributeHistoryDetail,
  IContributeSummary,
  IRequestGetContributeHistoryDetail,
  IRequestGetDividendDetail,
  IRequestGetHistoriesDividend,
} from '@type/wallet';

// Các request function nhận payload đã bị saga strip 2 callback, nên param
// dùng dạng Omit<IRequestX, 'onFailure' | 'onSuccess'>.
type WithoutCallbacks<T> = Omit<T, 'onFailure' | 'onSuccess'>;

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { CommonUtils } from '@utils';
import { ListApiResponse, SingleApiResponse } from '@type/common';
import { IStoreItem } from '@type/store';
import { IDividendHistory } from '@type';

export const getInfoProductCheckout = async (
  request: WithoutCallbacks<IRequestGetInfoProductCheckout>,
): Promise<ICheckoutInfo> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<SingleApiResponse<ICheckoutInfo>>(
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
): Promise<IStoreItem> => {
  const { cartItemId, ...body } = request;
  const response = await httpRequest.patch<SingleApiResponse<IStoreItem>>(
    EndPoints.PAYMENT.updateProductCart(cartItemId),
    body,
  );
  return response.data;
};

export const getListCart = async (
  request: WithoutCallbacks<IRequestGetListCart>,
): Promise<ListApiResponse<IStoreCartItem[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<IStoreCartItem[]>>
  >(EndPoints.PAYMENT.getListCart(params), { loading: false });
  return response?.data;
};

export const getCartDetail = async (
  request: WithoutCallbacks<IRequestGetCartDetail>,
): Promise<IStoreCartItem> => {
  const response = await httpRequest.get<SingleApiResponse<IStoreCartItem>>(
    EndPoints.PAYMENT.cartDetail(request.cartId),
    { loading: false },
  );
  return response.data;
};

export const getTotalItemCart = async (): Promise<ITotalItemCart> => {
  const response = await httpRequest.get<SingleApiResponse<ITotalItemCart>>(
    EndPoints.PAYMENT.countTotalItemCart,
    { loading: false },
  );
  return response?.data;
};

export const createOrder = async (
  request: WithoutCallbacks<IRequestCreateOrder>,
): Promise<ICreateOrderResponse> => {
  const response = await httpRequest.post<
    SingleApiResponse<ICreateOrderResponse>
  >(EndPoints.PAYMENT.createOrder, request);
  return response.data;
};

export const calculatePrice = async (
  request: WithoutCallbacks<IRequestCalculatePrice>,
): Promise<IPriceDetail> => {
  const response = await httpRequest.post<SingleApiResponse<IPriceDetail>>(
    EndPoints.PAYMENT.calculatePrice,
    request,
    { loading: false },
  );
  return response.data;
};

export const createLinkPaymentOrder = async (
  request: ICreateLinkPaymentOrderRequest,
): Promise<IResponseInitPayment> => {
  const orderId = request.orderId;
  delete request.orderId;
  const response = await httpRequest.post<
    SingleApiResponse<IResponseInitPayment>
  >(EndPoints.PAYMENT.createLinkPaymentOrder(orderId || 0), request);
  return response.data;
};

export const getOrderHistoryDetail = async (
  request: WithoutCallbacks<IRequestGetOrderHistoryDetail>,
): Promise<IOrderHistoryDetailItem> => {
  const response = await httpRequest.get<
    SingleApiResponse<IOrderHistoryDetailItem>
  >(EndPoints.PAYMENT.orderHistoryDetail(request.orderId), { loading: false });
  return response.data;
};

export const getOrderHistories = async (
  request: WithoutCallbacks<IRequestGetOrderHistories>,
): Promise<ListApiResponse<IOrderHistoryItem[]>> => {
  const params = CommonUtils.objectToQueryParams(
    CommonUtils.removeEmptyFieldObject(request, true),
  );
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<IOrderHistoryItem[]>>
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

export const generateQRRefundTransaction = async (
  request: WithoutCallbacks<IRequestGenerateQRRefundTransaction>,
): Promise<IGenerateQRCodeResponse> => {
  const response = await httpRequest.post<
    SingleApiResponse<IGenerateQRCodeResponse>
  >(EndPoints.PAYMENT.generateQRRefundTransaction, request);
  return response.data;
};

export const generateQRCodePay = async (
  request: WithoutCallbacks<IRequestGenerateQRCode>,
): Promise<IGenerateQRCodeResponse> => {
  const response = await httpRequest.post<
    SingleApiResponse<IGenerateQRCodeResponse>
  >(EndPoints.PAYMENT.generateQRCodePay, request);
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

export const reorder = async (
  request: WithoutCallbacks<IRequestReOrder>,
): Promise<IStoreCartItem> => {
  const response = await httpRequest.post<SingleApiResponse<IStoreCartItem>>(
    EndPoints.PAYMENT.reorder,
    request,
  );
  return response.data;
};

export const cancelOrder = async (
  request: WithoutCallbacks<IRequestCancelOrder>,
): Promise<void> => {
  // await httpRequest.post(EndPoints.PAYMENT.cancelOrder, request);
  return new Promise(resolve => {
    resolve()
  })
};

export const increaseContribution = async (
  request: WithoutCallbacks<IRequestIncreaseContribute>,
): Promise<IResponseIncreaseContribute> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseIncreaseContribute>
  >(EndPoints.CONTRIBUTION.increase, request);
  return response.data;
};

export const decreaseContribute = async (
  request: WithoutCallbacks<IRequestDecreaseContribute>,
): Promise<IKcpInitParams> => {
  const response = await httpRequest.post<SingleApiResponse<IKcpInitParams>>(
    EndPoints.CONTRIBUTION.decrease,
    request,
  );
  return response.data;
};

export const getContributeSummary = async (): Promise<IContributeSummary> => {
  const response = await httpRequest.get<SingleApiResponse<IContributeSummary>>(
    EndPoints.CONTRIBUTION.summary,
    { loading: false },
  );
  return response.data;
};

export const getContributeHistoryDetail = async (
  request: WithoutCallbacks<IRequestGetContributeHistoryDetail>,
): Promise<IContributeHistoryDetail> => {
  const response = await httpRequest.get<
    SingleApiResponse<IContributeHistoryDetail>
  >(EndPoints.CONTRIBUTION.historyDetail(request.historyId), {
    loading: false,
  });
  return response.data;
};

export const getDividendDetail = async (
  request: WithoutCallbacks<IRequestGetDividendDetail>,
): Promise<IContributeHistoryDetail> => {
  const response = await httpRequest.get<
    SingleApiResponse<IContributeHistoryDetail>
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
