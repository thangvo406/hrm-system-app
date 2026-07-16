import type {
  Product,
  IResponseProductDetail,
  IRequestCheckoutProduct,
  IRequestGetProductById,
  IRequestGetProducts,
} from '@type/products';

import { httpRequest } from '@services/common/httpRequest';
import { z } from 'zod';
import { EndPoints } from '@constants';
import { CommonUtils } from '@utils';
import { SingleApiResponse, ListApiResponse } from '@type/common';

export const productItemSchema = z.object({
  description: z.string(),
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  price: z.string(),
  thumbColor: z.string(),
});

export const productsResponseSchema = z.object({
  data: z.array(productItemSchema),
});

export const getProducts = async (
  request: IRequestGetProducts,
): Promise<ListApiResponse<Product[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<Product[]>>
  >(EndPoints.PRODUCTS.list(params), { loading: false });
  return response.data;
  // return productsResponseSchema.parse(response).data;
};

export const getProductById = async (
  request: IRequestGetProductById,
): Promise<IResponseProductDetail> => {
  const response = await httpRequest.get<SingleApiResponse<Product>>(
    EndPoints.PRODUCTS.detail(request.productId),
    { loading: false },
  );
  return response?.data;
};

export const checkoutProduct = async (
  request: IRequestCheckoutProduct,
): Promise<IResponseProductDetail> => {
  const response = await httpRequest.post<SingleApiResponse<Product>>(
    EndPoints.PAYMENT.checkout, request
  );
  return response?.data;
};
