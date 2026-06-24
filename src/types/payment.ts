import type { AppCallback } from './common';

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

export type GetInfoProductCheckoutPayload = {
  productId: number;
} & AppCallback;

export type RemoveCartItemPayload = {
  readonly cartItemId: number;
} & AppCallback;
