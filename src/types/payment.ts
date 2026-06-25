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

export type StoreCartItem = {
  id: number;
  userId: number;
  storeId: number;
  storeName: string;
  storeAddress: StoreAddress;
  subtotal: number;
  totalQuantity: number;
  items: ProductCart[];
  thumbnail: IImage;
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

export type CreateOrderPayload = AppCallback<CreateOrderResponse> &
  CreateOrderRequest;

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
