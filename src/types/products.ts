import type { AppCallback, IImage, ListApiResponse } from './common';
import { IAttributeCart } from './payment';

export interface IProduct {
  id: number;
  storeId: number;
  categoryId: number;
  code: string;
  name: string;
  description: string;
  sellingPrice: number;
  discountPrice: any;
  stockQuantity: number;
  status: string;
  sortOrder: number;
  thumbnail: IImage;
  images: IImage[];
  selectedAttributes?: IAttributeCart[];
  quantity?: number;
  productThumbnail: IImage;
  cartItemInfo: IProductCartItemInfo;
}

export interface IProductCartItemInfo {
  cartItemId: number;
  quantity: number;
  selectedAttributes: IAttributeCart[];
}
export interface IResponseProductDetail {
  id: number;
  storeId: number;
  categoryId: number;
  code: string;
  name: string;
  description: string;
  sellingPrice: number;
  discountPrice: any;
  stockQuantity: number;
  status: string;
  sortOrder: number;
  thumbnail: IImage;
  images: IImage[];
  attributes: IAttributeDetail[];
}

export interface IRequestGetProducts
  extends AppCallback<ListApiResponse<IProduct[]>> {
  storeId: number;
  sortBy?: 'price' | 'name' | 'sortOrder';
  sortDirection?: 'asc' | 'desc';
  page: number;
  size: number;
  keyword?: string;
}

export interface IRequestGetProductById
  extends AppCallback<IResponseProductDetail> {
  productId: number | string;
}

export interface IRequestCheckoutProduct
  extends AppCallback,
    IRequestCheckout {}

export interface IAttributeDetail {
  id: number;
  name: string;
  type: any;
  sortOrder: number;
  items: IAttributeItem[];
}

export interface IAttributeItem {
  id: number;
  name: string;
  price: number;
  sortOrder: number;
}

export interface IRequestCheckout {
  productId: number;
  quantity: number;
  selectedAttributes: AttributeCheckout[];
}

export interface AttributeCheckout {
  attributeItemId: number;
  attributeId: number;
  attributeName: string;
  attributeType: string;
  attributeItemName: string;
  price: number;
}
