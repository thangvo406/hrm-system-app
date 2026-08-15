import { IGenerateQRCodeResponse } from './account';
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

export interface IRequestGenerateQRRefundTransaction
  extends AppCallback<IGenerateQRCodeResponse> {
  orderId: number;
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
  couponId?: number;
}

export interface IResponseInitPayment {
  requiresRedirect: boolean;
  paymentType: string;
  paymentResult: any;
  kcpInitParams: IKcpInitParams;
  virtualAccount: any;
}
export interface IResponseContributeManualTransfer {
  id: number;
  type: string;
  displayType: string;
  amount: any;
  status: string;
  paymentCompleted: boolean;
  adminApproved: boolean;
  paymentFundingSource: string;
  paymentType: string;
  paymentMethod: any;
  requestedAt: string;
  processedAt: any;
  adminNote: any;
  kcpSessionData: any;
  virtualAccount: any;
  stdPaySessionData: any;
  manualTransfer: IManualTransfer;
}

export interface IManualTransfer {
  id: number;
  purpose: string;
  paymentIntentId: number;
  status: string;
  transferCode: string;
  declaredAmount: number;
  approvedAmount: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  universityId: number;
  universityName: string;
  decidedAt: any;
  adminNote: any;
  createdDate: string;
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
  pointAmount: number;
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
  readonly hasItems: boolean;
  readonly orderedAt: string;
  readonly summary: IOrderSummary;
}

export interface IRequestGetOrderHistories
  extends AppCallback<ListApiResponse<IOrderHistoryItem[]>> {
  readonly orderReceiveMethod?: string;
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
  paymentFundingSource: string;
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

export interface IPriceDetail {
  totalMoney: number;
  couponMoney: number;
  membershipDiscount: number;
  pointDiscount: number;
  totalDiscount: number;
  finalMoney: number;
}

export interface IRequestCalculatePrice extends AppCallback<IPriceDetail> {
  point: number;
  couponId: number;
  storeId: number;
  totalMoney: number;
}
export interface IOrderSummary {
  productPrice: number;
  attributePrice: number;
  voucherPrice: number;
  totalPrice: number;
  discountPrice: number;
  finalPrice: number;
  couponPrice?: number;
  membershipDiscount?: number;
  usedPointPrice?: number;
}

export interface IRequestGetOrderHistoryDetail
  extends AppCallback<IOrderHistoryDetailItem> {
  readonly orderId: string;
}

export interface IRequestDecreaseContribute
  extends AppCallback<IKcpInitParams> {
  units: number;
  requestReason?: string;
  refundBankName: string;
  refundBankAccountNumber: string;
  refundBankAccountHolder: string;
}
export interface IRequestReOrder extends AppCallback<IStoreCartItem> {
  orderId: number;
}
export interface IRequestInitCharge extends AppCallback<IKcpInitParams> {
  amount: number;
  payment: IPaymentRequest;
}

export interface IRequestGenerateQRCode
  extends AppCallback<IGenerateQRCodeResponse> {
  readonly usePoint?: number;
  readonly useMoney?: number;
}

export interface ITransactionDetail {
  transactionKey: string;
  occurredAt: string;
  headlineAction: string;
  headlineFundingSource: string;
  paymentFundingSource?: string;
  order: ITransactionOrder;
  withdrawal: any;
  legs: ITransactionLeg[];
}

export interface ITransactionOrder {
  orderId: number;
  orderNumber: string;
  storeName: string;
  totalAmount: number;
  totalDiscountAmount: number;
  voucherAmount: number;
  couponCode: string;
  cancelQrAvailable: boolean;
  couponName: string;
  couponDiscountAmount: number;
  memberDiscountAmount: number;
  storeDiscountRate: any;
  benefitDiscountRate: any;
  memberGrade: any;
  usedPointAmount: number;
  settledMoneyAmount: number;
}
export interface ITransactionLeg {
  transactionKey: string;
  sourceType: string;
  sourceId: number;
  occurredAt: string;
  direction: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  balanceAccountType: string;
  entryType: string;
  fundingSource: string;
  purpose: string;
  description: any;
  paymentType: any;
  easyPayMethod: any;
  approvalNo: any;
  storeId: number;
  storeName: string;
  orderId: number;
  orderNumber: string;
  organizationId: any;
  organizationName: any;
  pointExpiresAt?: string;
  pointRemainingAmount?: number;
  memberGrade?: string;
  storeRate?: number;
  payMoneyRate: any;
  benefitRate?: number;
  totalRate?: number;
}
