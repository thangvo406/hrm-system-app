import type { AppCallback, IImage, ListApiResponse } from './common';

export interface StoreItem {
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
  totalAmountCart: number;
  cartId: number;
}

export interface Product {
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
}

export interface TOperatingHour {
  dayOfWeek: string;
  open: boolean;
  openTime: string;
  closeTime: string;
}

export interface StoreProductItem {
  id: number;
  name: string;
  price: number;
  thumbnail?: { fileUrl: string };
}

export interface IRequestGetStoreDetail extends AppCallback<StoreItem> {
  storeId: number | string;
}

export interface IRequestGetStores
  extends AppCallback<ListApiResponse<StoreItem[]>> {
  keyword?: string;
  page: number;
  size: number;
}
