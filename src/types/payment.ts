import type { AppCallback, IImage, ListApiResponse } from './common';
import type { IRequestCheckout, Product } from './products';

export type CheckoutInfoItem = {
  readonly attributeItemId: number;
};

export type CheckoutInfo = {
  readonly quantity: number;
  readonly finalPrice: number;
  readonly selectedAttributes: CheckoutInfoItem[];
  readonly subTotal: number;
  readonly cartItemId: number;
};

export type TotalItemCart = {
  readonly totalCart: number;
};

export interface PaymentRequest {
  paymentType: string;
  paymentMethodId?: number;
  easyPayMethod?: string;
  vaBankCode?: string;
}

export type StoreCartItem = {
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
};

export interface ProductCreateOrder {
  id: number;
  quantity: number;
  selectedAttributes: AttributeCart[];
}
export interface VoucherOrder {
  id: number;
  quantity: number;
}
export interface CreateOrderRequest {
  storeId: number;
  note: string;
  address: string;
  products: ProductCreateOrder[];
  vouchers: VoucherOrder[];
}

export type StoreAddress = {
  addressText: string;
  latitude: string;
  longitude: string;
};

export type IRequestGetListCart = {
  page: number;
  size: number;
};

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
}

export interface AttributeCart {
  attributeId: number;
  attributeName: string;
  attributeType: string;
  attributeItemId: number;
  attributeItemName: string;
  price: number;
}

export type GetTotalItemCartPayload = AppCallback<TotalItemCart>;

export type GetListCartPayload = AppCallback<ListApiResponse<StoreCartItem[]>> &
  IRequestGetListCart;

export type GetCartDetailRequest = {
  readonly cartId: number;
};

export type GetCartDetailPayload = AppCallback<StoreCartItem> & GetCartDetailRequest;

export type GetInfoProductCheckoutPayload = {
  readonly productId: number;
} & AppCallback<CheckoutInfo>;

export type UpdateCartItemPayload = {
  readonly cartItemId: number;
} & AppCallback &
  IRequestCheckout;

export type RemoveCartItemPayload = {
  readonly cartItemId: number;
} & AppCallback;

export interface ICallbackCreateOrder {
  responseCreateOrder: CreateOrderResponse;
  responsePayment: IResponseInitPayment;
}

export type CreateOrderPayload = {
  createLinkRequest: CreateLinkPaymentOrderRequest;
} & AppCallback<ICallbackCreateOrder> &
  CreateOrderRequest;

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
export interface IncreaseContributeRequest {
  amount: number;
  payment: PaymentRequest;
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

export type OrderHistoryItem = {
  readonly id: string;
  readonly storeLogo: IImage;
  readonly totalAmount: number;
  readonly storeName: string;
  readonly orderNumber: string;
  readonly orderedAt: string;
};

export type GetOrderHistoriesRequest = {
  readonly page: number;
  readonly size: number;
};

export type GetOrderHistoriesPayload = GetOrderHistoriesRequest &
  AppCallback<ListApiResponse<OrderHistoryItem[]>>;

export type OrderHistoryDetailItem = {
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
};

export interface OrderSummary {
  productPrice: number;
  attributePrice: number;
  voucherPrice: number;
  totalPrice: number;
  discountPrice: number;
  finalPrice: number;
}

export type OrderHistoryDetailProduct = {
  readonly id: string;
  readonly name: string;
  readonly attributes: string;
  readonly quantity: number;
  readonly price: number;
  readonly imageUrl: string;
};

export type GetOrderHistoryDetailRequest = {
  readonly orderId: string;
};

export type GetOrderHistoryDetailPayload = GetOrderHistoryDetailRequest &
  AppCallback<OrderHistoryDetailItem>;

export type GetAddressOrderRecentPayload = AppCallback<string[]>;

export type GenerateQRCodeRequest = {
  readonly orderId?: string;
};

export type GenerateQRCodeResponse = {
  readonly expiresIn: number;
  readonly qrData: string;
};

export type InitChargeRequest = {
  amount: number;
  payment: PaymentRequest;
};

export type InitChargePayload = AppCallback<IKcpInitParams> & InitChargeRequest;

export type GenerateQRCodePayload = AppCallback<GenerateQRCodeResponse> &
  GenerateQRCodeRequest;

export type IncreaseContributePayload = AppCallback & IncreaseContributeRequest;

export type ContributeSummary = {
  readonly currentContribution: number;
  readonly totalDividend: number;
  readonly expectedDividend: number;
  readonly expectedDividendDate: string;
};

export type ContributeHistoryDetail = {
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
};

export type GetContributeHistoryDetailRequest = {
  readonly historyId: number | string;
};

export type GetContributeHistoryDetailPayload =
  GetContributeHistoryDetailRequest & AppCallback<ContributeHistoryDetail>;

export type GetContributeSummaryPayload = AppCallback<ContributeSummary>;
