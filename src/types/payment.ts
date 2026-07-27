import type { AppCallback, IImage, ListApiResponse } from './common';
import type { IRequestCheckout, IProduct } from './products';

export interface ICheckoutInfoItem {
  readonly attributeItemId: number;
}

export interface ICheckoutInfo {
  readonly quantity: number;
  readonly finalPrice: number;
  readonly selectedAttributes: ICheckoutInfoItem[];
  readonly subTotal: number;
  readonly cartItemId: number;
}

export interface ITotalItemCart {
  readonly totalCart: number;
}

export interface IPaymentRequest {
  paymentType: string;
  paymentMethodId?: number;
  easyPayMethod?: string;
  vaBankCode?: string;
}

export interface IStoreCartItem {
  id: number;
  userId: number;
  storeId: number;
  storeName: string;
  storeAddress: IStoreAddress;
  subTotal: number;
  totalQuantity: number;
  items: IProductCart[];
  storeLogo: IImage;
  storeReceiveMethod: string[];
}

export interface IProductCreateOrder {
  id: number;
  quantity: number;
  selectedAttributes: IAttributeCart[];
}
export interface IVoucherOrder {
  id: number;
  quantity: number;
}
export interface IStoreAddress {
  addressText: string;
  latitude: string;
  longitude: string;
}

export interface IRequestGetListCart
  extends AppCallback<ListApiResponse<IStoreCartItem[]>> {
  page: number;
  size: number;
}

export interface IProductCart {
  id: number;
  productId: number;
  productCode: string;
  productName: string;
  productThumbnailUrl: IImage;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  selected: boolean;
  selectedAttributes: IAttributeCart[];
  productDeleted: boolean;
  productStatus: string;
  productStockQuantity: number;
}

export interface IAttributeCart {
  attributeId: number;
  attributeName: string;
  attributeType: string;
  attributeItemId: number;
  attributeItemName: string;
  price: number;
}

export interface IRequestGetCartDetail extends AppCallback<IStoreCartItem> {
  readonly cartId: number;
}

export interface IRequestGetInfoProductCheckout
  extends AppCallback<ICheckoutInfo> {
  readonly productId: number;
}

export interface IRequestUpdateCartItem
  extends AppCallback<IStoreCartItem>,
    IRequestCheckout {
  readonly cartItemId: number;
}

export interface IRequestRemoveCartItem extends AppCallback {
  readonly cartItemId: number;
}

export interface ICallbackCreateOrder {
  responseCreateOrder: ICreateOrderResponse;
  responsePayment: IResponseInitPayment;
}

export interface IRequestCreateOrder extends AppCallback<ICallbackCreateOrder> {
  address: string;
  createLinkRequest: ICreateLinkPaymentOrderRequest;
  addressDetail: string;
  receiveMethod?: string;
  products: IProductCreateOrder[];
  storeId: number;
  vouchers: IVoucherOrder[];
}

export interface IResponseInitPayment {
  requiresRedirect: boolean;
  paymentType: string;
  paymentResult: any;
  kcpInitParams: IKcpInitParams;
  virtualAccount: any;
}

export interface IKcpInitParams {
  qtid: string;
  orderNo: string;
  siteCd: string;
  reqType: string;
  reqAmt: string;
  kcpWebViewUrl: string;
  qpaySdkUrl?: string;
}
export interface ICreateLinkPaymentOrderRequest {
  orderId?: number;
  payment: IPaymentRequest;
}
export interface ICreateOrderResponse {
  id: number;
  userId: number;
  storeId: number;
  storeName: string;
  createdBy: any;
  status: string;
  note: string;
  address: IOrderAddress;
  summary: IOrderSummary;
  paymentDueAt: string;
  createdTime: string;
  updatedTime: string;
}

export interface IOrderAddress {
  addressText: string;
  latitude: any;
  longitude: any;
}

export interface IOrderHistoryItem {
  readonly id: string;
  readonly storeLogo: IImage;
  readonly totalAmount: number;
  readonly storeName: string;
  readonly orderNumber: string;
  readonly orderedAt: string;
}

export interface IRequestGetOrderHistories
  extends AppCallback<ListApiResponse<IOrderHistoryItem[]>> {
  readonly page: number;
  readonly size: number;
}

export interface IOrderHistoryDetailItem {
  id: number;
  orderNumber: string;
  orderedAt: string;
  orderReceiveMethod: string;
  userId: number;
  userName: string;
  userPhone: string;
  storeId: number;
  storeName: string;
  storeAddress: IStoreAddress;
  storeLogo: IImage;
  status: string;
  note: any;
  products: IProduct[];
  totalAmount: number;
  address: any;
  addressDetail?: any;
  summary: IOrderSummary;
  paymentDueAt: string;
  createdDate: string;
  updatedDate: string;
}

export interface IOrderSummary {
  productPrice: number;
  attributePrice: number;
  voucherPrice: number;
  totalPrice: number;
  discountPrice: number;
  finalPrice: number;
}

export interface IRequestGetOrderHistoryDetail
  extends AppCallback<IOrderHistoryDetailItem> {
  readonly orderId: string;
}

export interface IGenerateQRCodeResponse {
  readonly expiresIn: number;
  readonly qrData: string;
}

export interface IRequestInitCharge extends AppCallback<IKcpInitParams> {
  amount: number;
  payment: IPaymentRequest;
}

export interface IRequestGenerateQRCode
  extends AppCallback<IGenerateQRCodeResponse> {
  readonly orderId?: string;
}

export interface ITransactionDetail {
  readonly id: string;
  readonly productName: string;
  readonly paidAt: string;
  readonly paymentAmount: number;
  readonly couponDiscount: number;
  readonly couponName?: string;
  readonly pointUsed: number;
  readonly finalPaymentAmount: number;
  readonly payMoneyAmount: number;
  readonly pointEarned: number;
}
