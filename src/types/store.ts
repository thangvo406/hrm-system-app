import type { AppCallback, IImage, ListApiResponse } from './common';

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
  receiveMethod: string[];
  products: Product[];
};

export type Product = {
  id: number;
  storeId: number;
  categoryId: number;
  code: string;
  name: string;
  description: string;
  sellingPrice: number;
  discountPrice: number;
  stockQuantity: number;
  status: string;
  sortOrder: number;
  thumbnail: IImage;
  images: IImage[];
};

export type TOperatingHour = {
  dayOfWeek: string;
  open: boolean;
  openTime: string;
  closeTime: string;
};

export type StoreProductItem = {
  id: number;
  name: string;
  price: number;
  thumbnail?: { fileUrl: string };
};

export type GetStoreDetailPayload = {
  storeId: number | string;
} & AppCallback<StoreItem>;

export type GetStoreOrderRecentActionPayload = AppCallback<StoreItem[]>;

export type GetStoresPayload = {
  page: number;
  size: number;
  keyword?: string;
} & AppCallback<ListApiResponse<StoreItem[]>>;
