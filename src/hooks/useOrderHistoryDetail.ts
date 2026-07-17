import AppNavigator from '@navigation/AppNavigator';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAppDispatch } from '@services/common/storeHooks';
import { getOrderHistoryDetailRequest } from '@services/slices/payment/paymentSlice';
import { IOrderHistoryDetailItem } from '@type';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useOrderHistoryDetail(props: any) {
  const { data: orderItem } = AppNavigator.getParams(props);
  const { t } = useTranslation();
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [data, setData] = useState<IOrderHistoryDetailItem>();
  const dispatch = useAppDispatch();
  const toggleShowAllProducts = () => setShowAllProducts(prev => !prev);

 const isSuccess =  data?.status === 'COMPLETED'

  const onPressCopyOrderNumber = () => {
    Clipboard.setString(data?.orderNumber ?? '');
    AppNavigator.showSnackBar({
      message: t('order_history_detail.copy_order_number_success'),
      type: 'success',
    });
  };

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
    isSuccess,
    onPressCopyOrderNumber,
    showAllProducts,
    toggleShowAllProducts,
    visibleProducts,
  };
}
