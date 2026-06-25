import type { AppCallback, IImage, ListApiResponse } from './common';
import type { IRequestCheckout } from './products';

export type CheckoutInfoItem = {
  readonly attributeItemId: number;
  // readonly name: string;
  // readonly productId: number;
  // readonly quantity: number;
  // readonly thumbnail?: string;
  // readonly unitPrice: number;
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

export type GetTotalItemCartPayload = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (data: TotalItemCart) => void;
};
export interface StoreCartItem {
  id: number;
  userId: number;
  storeId: number;
  storeName: string;
  storeAddress: StoreAddress;
  subtotal: number;
  totalQuantity: number;
  items: any[];
  thumbnail: IImage;
}

export interface StoreAddress {
  addressText: string;
  latitude: string;
  longitude: string;
}

export interface IRequestGetListCart {
  page: number;
  size: number;
}

export type GetListCartPayload = IRequestGetListCart & {
  readonly onSuccess?: (data: ListApiResponse<StoreCartItem[]>) => void;
  readonly onFailure?: (error: string) => void;
};

export type GetInfoProductCheckoutPayload = {
  productId: number;
} & AppCallback;

export type UpdateCartItemPayload = {
  readonly cartItemId: number;
} & AppCallback &
  IRequestCheckout;

export type RemoveCartItemPayload = {
  readonly cartItemId: number;
} & AppCallback;
