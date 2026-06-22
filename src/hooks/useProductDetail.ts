import type { IResponseProductDetail } from '@type/products';

import { useAppDispatch } from '@services/common/storeHooks';
import {
  checkoutProductRequest,
  getProductByIdRequest,
} from '@services/slices/products/productsSlice';
import { useEffect, useState } from 'react';
import AppNavigator from '@navigation/AppNavigator';
import SelectQuality from '@screens/Dialog/components/SelectQuality';
import { useTranslation } from 'react-i18next';

export type { Product } from '@type/products';

export const useProductDetail = (props: any) => {
  const { id: productId, storeId } = AppNavigator.getParams(props);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
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

  const handleAddCart = (quantity: number, note: string) => {
    dispatch(
      checkoutProductRequest({
        note,
        products: [
          {
            id: productId,
            quantity: quantity,
          },
        ],
        storeId,
        vouchers: [],
        onSuccess: () => {
          AppNavigator.showSnackBar({
            message: t('product_detail.add_cart_success'),
            type: 'success',
          });
        },
        onFailure: (message: string) => {
          AppNavigator.showSnackBar({
            message: message || '',
            type: 'failed',
          });
        },
      }),
    );
  };

  return {
    error,
    loading,
    data,
    onPressCart,
  };
};
