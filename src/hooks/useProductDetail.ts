import type { IResponseProductDetail } from '@type/products';

import { useAppDispatch } from '@services/common/storeHooks';
import { getProductByIdRequest } from '@services/slices/products/productsSlice';
import { useEffect, useState } from 'react';
import AppNavigator from '@navigation/AppNavigator';
import SelectQuality from '@screens/Dialog/components/SelectQuality';

export type { Product } from '@type/products';

export const useProductDetail = (props: any) => {
  const { id: productId } = AppNavigator.getParams(props);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<IResponseProductDetail | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSuccess = (data: IResponseProductDetail) => {
    setData(data);
    setLoading(false);
  };

  const handleFailure = (message: string) => {
    setError(message);
    setLoading(false);
  };

  useEffect(() => {
    if (productId == null || productId === '') {
      setLoading(false);
      setError('Missing product id');
      return;
    }
    setLoading(true);
    setError(undefined);
    dispatch(
      getProductByIdRequest({
        onFailure: handleFailure,
        onSuccess: handleSuccess,
        productId,
      }),
    );
  }, [dispatch, productId]);

  const onPressCart = () => {
    // TODO: navigate to cart screen once available
    AppNavigator.showDialog({
      screen: SelectQuality,
      data,
      onSubmit: handleAddCart,
    });
  };

  const handleAddCart = () => {};

  return {
    error,
    loading,
    data,
    onPressCart,
  };
};
