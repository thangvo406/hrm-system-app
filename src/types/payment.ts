import type { AppCallback } from './common';

export type CheckoutInfoItem = {
  readonly finalPrice: number;
  readonly name: string;
  readonly productId: number;
  readonly quantity: number;
  readonly thumbnail?: string;
  readonly unitPrice: number;
};

export type CheckoutInfo = {
  readonly discount: number;
  readonly finalPrice: number;
  readonly items: CheckoutInfoItem[];
  readonly subTotal: number;
};

export type GetInfoProductCheckoutPayload = {
  storeId: number;
} & AppCallback;
