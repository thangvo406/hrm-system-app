import type { AppCallback, IImage, ListApiResponse } from './common';
import { IProduct } from './products';

export interface IStoreItem {
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
  openingTime: string;
  closedTime: string;
  minOrder: string;
  sortOrder: number;
  receiveMethod: string[];
  products: IProduct[];
  totalAmountCart: number;
  cartId: number;
}

export interface TOperatingHour {
  dayOfWeek: string;
  open: boolean;
  openTime: string;
  closeTime: string;
}

export interface IRequestGetStoreDetail extends AppCallback<IStoreItem> {
  storeId: number | string;
}

export interface IRequestGetStores
  extends AppCallback<ListApiResponse<IStoreItem[]>> {
  keyword?: string;
  page: number;
  size: number;
}
