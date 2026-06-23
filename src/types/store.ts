import type { IImage, ListApiResponse } from './common';

import { AppCallback } from './common';

export type StoreItem = {
  id: number;
  universityId: number;
  code: string;
  name: string;
  phone: string;
  address: string;
  logo: IImage;
  banner: IImage;
  operatingHours: TOperatingHour[];
  status: string;
  estimateTime: string;
  minOrder: string;
  sortOrder: number;
  products: Product[];
};

export interface Product {
  id: number;
  storeId: number;
  categoryId: number;
  code: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  status: string;
  sortOrder: number;
  thumbnail: IImage;
  images: IImage[];
}

export interface TOperatingHour {
  dayOfWeek: string;
  open: boolean;
  openTime: string;
  closeTime: string;
}
export type StoreProductItem = {
  id: number;
  name: string;
  price: number;
  thumbnail?: { fileUrl: string };
};

export type StoresCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (response: ListApiResponse<StoreItem[]>) => void;
};

export interface GetStoresPayload extends AppCallback {
  page: number;
  size: number;
  keyword?: string;
}

export type GetStoresActionPayload = Omit<
  GetStoresPayload,
  'onFailure' | 'onSuccess'
> &
  StoresCallback;

export type StoreDetailCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (detail: StoreItem) => void;
};

export interface GetStoreDetailPayload extends AppCallback {
  storeId: number | string;
}

export type GetStoreDetailActionPayload = Omit<
  GetStoreDetailPayload,
  'onFailure' | 'onSuccess'
> &
  StoreDetailCallback;

export type StoreOrderRecentCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (data: StoreItem) => void;
};

export type GetStoreOrderRecentActionPayload = StoreOrderRecentCallback;
