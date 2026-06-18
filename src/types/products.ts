import type { ListApiResponse } from './common';

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
  thumbnail: any;
  images: any[];
};

export type ProductsCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (response: ListApiResponse<Product[]>) => void;
};

export interface GetProductsPayload extends ProductsCallback {
  storeId: number;
  sortBy?: 'price' | 'name' | 'sortOrder';
  sortDirection?: 'asc' | 'desc';
  page: number;
  size: number;
}
