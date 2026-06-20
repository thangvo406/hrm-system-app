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
}
export interface GetProductsPayload extends ProductsCallback {
  storeId: number;
  sortBy?: 'price' | 'name' | 'sortOrder';
  sortDirection?: 'asc' | 'desc';
  page: number;
  size: number;
}

export type ProductDetailCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (product: Product) => void;
};

export type GetProductByIdPayload = {
  productId: number | string;
} & ProductDetailCallback;

export type CheckoutProductPayload = AppCallback & IRequestCheckout;

export interface IRequestCheckout {
  storeId: number
  note?: string
  products: ProductCheckout[]
  vouchers?: VoucherCheckout[]
}

export interface ProductCheckout {
  id: number
  quantity: number
}

export interface VoucherCheckout {
  id: number
  quantity: number
}
