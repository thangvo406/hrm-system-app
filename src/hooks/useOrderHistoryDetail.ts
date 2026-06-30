import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch } from '@services/common/storeHooks';
import { getOrderHistoryDetailRequest } from '@services/slices/payment/paymentSlice';
import { OrderHistoryDetailItem } from '@type';
import { useEffect, useState } from 'react';

export function useOrderHistoryDetail(props: any) {
  const { data: orderItem } = AppNavigator.getParams(props);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [data, setData] = useState<OrderHistoryDetailItem>();
  const dispatch = useAppDispatch();
  const toggleShowAllProducts = () => setShowAllProducts(prev => !prev);

  useEffect(() => {
    dispatch(
      getOrderHistoryDetailRequest({
        orderId: orderItem?.id,
        onSuccess: (_data: any) => {
          setData(_data);
        },
      }),
    );
  }, []);

  const visibleProducts = showAllProducts
    ? data?.products
    : data?.products?.slice(0, 3);

  return {
    data,
    showAllProducts,
    toggleShowAllProducts,
    visibleProducts,
  };
}
