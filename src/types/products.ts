import type { AppCallback, IImage, ListApiResponse } from './common';
import { AttributeCart } from './payment';

export interface ProductImage {
  readonly fileUrl: string;
}

export interface Product {
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
  thumbnail: ProductImage;
  images: ProductImage[];
  selectedAttributes?: AttributeCart[];
  quantity?: number;
  productThumbnail: IImage;
  cartItemInfo: IProductCartItemInfo;
}

export interface IProductCartItemInfo {
  cartItemId: number;
  quantity: number;
  selectedAttributes: AttributeCart;
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
  thumbnail: ProductImage;
  images: ProductImage[];
  attributes: AttributeDetail[];
}

export interface IRequestGetProducts
  extends AppCallback<ListApiResponse<Product[]>> {
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

export interface AttributeDetail {
  id: number;
  name: string;
  type: any;
  sortOrder: number;
  items: AttributeItem[];
}

export interface AttributeItem {
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

export interface ProductCheckout {
  id: number;
  quantity: number;
}

export interface VoucherCheckout {
  id: number;
  quantity: number;
}
