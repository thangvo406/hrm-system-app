import type { AppCallback, IImage, ListApiResponse } from './common';
import type { IRequestCheckout, Product } from './products';
import { IDividendHistory } from './wallet';

export interface CheckoutInfoItem {
  readonly attributeItemId: number;
}

export interface CheckoutInfo {
  readonly quantity: number;
  readonly finalPrice: number;
  readonly selectedAttributes: CheckoutInfoItem[];
  readonly subTotal: number;
  readonly cartItemId: number;
}

export interface TotalItemCart {
  readonly totalCart: number;
}

export interface PaymentRequest {
  paymentType: string;
  paymentMethodId?: number;
  easyPayMethod?: string;
  vaBankCode?: string;
}

export interface StoreCartItem {
  id: number;
  userId: number;
  storeId: number;
  storeName: string;
  storeAddress: StoreAddress;
  subTotal: number;
  totalQuantity: number;
  items: ProductCart[];
  storeLogo: IImage;
  storeReceiveMethod: string[];
}

export interface ProductCreateOrder {
  id: number;
  quantity: number;
  selectedAttributes: AttributeCart[];
}
export interface VoucherOrder {
  id: number;
  quantity: number;
}
export interface StoreAddress {
  addressText: string;
  latitude: string;
  longitude: string;
}

export interface IRequestGetListCart
  extends AppCallback<ListApiResponse<StoreCartItem[]>> {
  page: number;
  size: number;
}

export interface ProductCart {
  id: number;
  productId: number;
  productCode: string;
  productName: string;
  productThumbnailUrl: IImage;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  selected: boolean;
  selectedAttributes: AttributeCart[];
  productDeleted: boolean;
  productStatus: string;
  productStockQuantity: number;
}

export interface AttributeCart {
  attributeId: number;
  attributeName: string;
  attributeType: string;
  attributeItemId: number;
  attributeItemName: string;
  price: number;
}

export interface IRequestGetCartDetail extends AppCallback<StoreCartItem> {
  readonly cartId: number;
}

export interface IRequestGetInfoProductCheckout
  extends AppCallback<CheckoutInfo> {
  readonly productId: number;
}

export interface IRequestUpdateCartItem extends AppCallback, IRequestCheckout {
  readonly cartItemId: number;
}

export interface IRequestRemoveCartItem extends AppCallback {
  readonly cartItemId: number;
}

export interface ICallbackCreateOrder {
  responseCreateOrder: CreateOrderResponse;
  responsePayment: IResponseInitPayment;
}

export interface IRequestCreateOrder extends AppCallback<ICallbackCreateOrder> {
  address: string;
  createLinkRequest: CreateLinkPaymentOrderRequest;
  note: string;
  products: ProductCreateOrder[];
  storeId: number;
  vouchers: VoucherOrder[];
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
}
export interface CreateLinkPaymentOrderRequest extends PaymentRequest {
  orderId: number;
}
export interface CreateOrderResponse {
  id: number;
  userId: number;
  storeId: number;
  storeName: string;
  createdBy: any;
  status: string;
  note: string;
  address: OrderAddress;
  summary: OrderSummary;
  paymentDueAt: string;
  createdTime: string;
  updatedTime: string;
}

export interface OrderAddress {
  addressText: string;
  latitude: any;
  longitude: any;
}

export interface OrderSummary {
  productPrice: number;
  attributePrice: number;
  voucherPrice: number;
  totalPrice: number;
  discountPrice: number;
  finalPrice: number;
}

export type OrderHistoryAction = 'rate' | 'reorder';

export interface OrderHistoryItem {
  readonly id: string;
  readonly storeLogo: IImage;
  readonly totalAmount: number;
  readonly storeName: string;
  readonly orderNumber: string;
  readonly orderedAt: string;
}

export interface IRequestGetOrderHistories
  extends AppCallback<ListApiResponse<OrderHistoryItem[]>> {
  readonly page: number;
  readonly size: number;
}

export interface OrderHistoryDetailItem {
  id: number;
  orderNumber: string;
  orderedAt: string;
  orderReceiveMethod: string;
  userId: number;
  userName: string;
  userPhone: string;
  storeId: number;
  storeName: string;
  storeAddress: StoreAddress;
  storeLogo: IImage;
  status: string;
  note: any;
  products: Product[];
  totalAmount: number;
  address: any;
  addressDetail: any;
  summary: OrderSummary;
  paymentDueAt: string;
  createdDate: string;
  updatedDate: string;
}

export interface OrderSummary {
  productPrice: number;
  attributePrice: number;
  voucherPrice: number;
  totalPrice: number;
  discountPrice: number;
  finalPrice: number;
}

export interface OrderHistoryDetailProduct {
  readonly id: string;
  readonly name: string;
  readonly attributes: string;
  readonly quantity: number;
  readonly price: number;
  readonly imageUrl: string;
}

export interface IRequestGetOrderHistoryDetail
  extends AppCallback<OrderHistoryDetailItem> {
  readonly orderId: string;
}

export interface GenerateQRCodeResponse {
  readonly expiresIn: number;
  readonly qrData: string;
}

export interface IRequestInitCharge extends AppCallback<IKcpInitParams> {
  amount: number;
  payment: PaymentRequest;
}

export interface IRequestGenerateQRCode
  extends AppCallback<GenerateQRCodeResponse> {
  readonly orderId?: string;
}

export interface IRequestIncreaseContribute extends AppCallback {
  amount: number;
  payment: PaymentRequest;
}

export interface ContributeSummary {
  readonly currentContribution: number;
  readonly totalDividend: number;
  readonly expectedDividend: number;
  readonly expectedDividendDate: string;
}

export interface ContributeHistoryDetail {
  id: number;
  type: string;
  displayType: string;
  amount: number;
  status: string;
  paymentCompleted: boolean;
  adminApproved: boolean;
  paymentMethod: string;
  requestedAt: string;
  processedAt: string;
  adminNote: string;
  kcpSessionData: string;
  virtualAccount: string;
}

export interface IRequestGetContributeHistoryDetail
  extends AppCallback<ContributeHistoryDetail> {
  readonly historyId: number | string;
}

export interface IRequestGetHistoriesDividend
  extends AppCallback<ListApiResponse<IDividendHistory[]>> {
  readonly page: number;
  readonly size: number;
}
