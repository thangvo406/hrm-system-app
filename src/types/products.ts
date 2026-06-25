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

export type IResponseProductDetail = {
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
};

export type GetProductsPayload = {
  storeId: number;
  sortBy?: 'price' | 'name' | 'sortOrder';
  sortDirection?: 'asc' | 'desc';
  page: number;
  size: number;
  keyword?: string;
} & AppCallback<ListApiResponse<Product[]>>;

export type GetProductByIdPayload = {
  productId: number | string;
} & AppCallback<IResponseProductDetail>;

export type CheckoutProductPayload = AppCallback & IRequestCheckout;

export type AttributeDetail = {
  id: number;
  name: string;
  type: any;
  sortOrder: number;
  items: AttributeItem[];
};

export type AttributeItem = {
  id: number;
  name: string;
  price: number;
  sortOrder: number;
};

export type IRequestCheckout = {
  productId: number;
  quantity: number;
  selectedAttributes: AttributeCheckout[];
};

export type AttributeCheckout = {
  attributeItemId: number;
  attributeId: number;
  attributeName: string;
  attributeType: string;
  attributeItemName: string;
  price: number;
};

export type ProductCheckout = {
  id: number;
  quantity: number;
};

export type VoucherCheckout = {
  id: number;
  quantity: number;
};
