import type { Product, GetProductsPayload } from '@type/products';

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
  request: GetProductsPayload,
): Promise<ListApiResponse<Product[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  console.log('getProducts', request);
  console.log('_request', _request);
  const params = CommonUtils.objectToQueryParams(_request);
  console.log('params', params);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<Product[]>>
  >(EndPoints.PRODUCTS.list(params), { loading: false });
  console.log('response', response);
  return response.data;
  // return productsResponseSchema.parse(response).data;
};
