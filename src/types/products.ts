import type { AppCallback, ListApiResponse } from './common';

export type ProductImage = {
  readonly fileUrl: string;
};

export type Product = {
  id: number;
  storeId: number;
  categoryId: number;
  code: string;
  name: string;
  description: string;
  price: number;
  discountPrice: any;
  stockQuantity: number;
  status: string;
  sortOrder: number;
  thumbnail: ProductImage;
  images: ProductImage[];
};

export type ProductsCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (response: ListApiResponse<Product[]>) => void;
};

export interface IResponseProductDetail {
  id: number;
  storeId: number;
  categoryId: number;
  code: string;
  name: string;
  description: string;
  price: number;
  discountPrice: any;
  stockQuantity: number;
  status: string;
  sortOrder: number;
  thumbnail: ProductImage;
  images: ProductImage[];
  attributes: AttributeDetail[];
}
export interface GetProductsPayload extends ProductsCallback {
  storeId: number;
  sortBy?: 'price' | 'name' | 'sortOrder';
  sortDirection?: 'asc' | 'desc';
  page: number;
  size: number;
  keyword?: string;
}

export type ProductDetailCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (product: IResponseProductDetail) => void;
};

export type GetProductByIdPayload = {
  productId: number | string;
} & ProductDetailCallback;

export type CheckoutProductPayload = AppCallback & IRequestCheckout;

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
}
export interface ProductCheckout {
  id: number;
  quantity: number;
}

export interface VoucherCheckout {
  id: number;
  quantity: number;
}
