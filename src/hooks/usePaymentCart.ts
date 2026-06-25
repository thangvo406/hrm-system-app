import Selection from '@dialogs/Selection';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useAppDispatch } from '@services/common/storeHooks';
import { createOrderRequest } from '@services/slices/payment/paymentSlice';
import type { CreateOrderResponse } from '@type';
import { upperCaseFirstChar } from '@utils/common';
import { useEffect, useMemo, useState } from 'react';

export type DeliveryTab = 'DELIVERY' | 'PICKUP';
export type PaymentCartMethod = 'coop_pay' | 'credit_card' | 'easy_payment';

export type UsePaymentCart = ReturnType<typeof usePaymentCart>;
const MOCK_ADDRESS = 'Room 301, 4th Floor, Engineering Building';

const DATA_PICKUP_TIME = [
  {
    id: 15,
    label: '15 minutes',
  },
  {
    id: 20,
    label: '20 minutes',
  },
  {
    id: 30,
    label: '30 minutes',
  },
  {
    id: 45,
    label: '45 minutes',
  },
];

const PICKUP_DEFAULT = DATA_PICKUP_TIME[0];

export const usePaymentCart = (props: any) => {
  const { data } = AppNavigator.getParams(props);
  const [deliveryTab, setDeliveryTab] = useState<DeliveryTab>();
  const dispatch = useAppDispatch();

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentCartMethod>('coop_pay');
  const [pickupTime, setPickupTime] = useState(PICKUP_DEFAULT);

  const shippingTabs = useMemo(() => {
    return data.storeReceiveMethod?.map(item => {
      return {
        id: item,
        label: upperCaseFirstChar(item.toLowerCase()),
      };
    });
  }, [data]);

  useEffect(() => {
    if (data.storeReceiveMethod?.length > 0) {
      setDeliveryTab(data.storeReceiveMethod[0]);
    }
  }, [data]);

  const onPressPickupTime = () => {
    AppNavigator.showDialog({
      screen: Selection,
      title: 'Select Pickup Time',
      popupType: 'bottomSheet',
      items: DATA_PICKUP_TIME,
      selectedId: pickupTime.id,
      onSelect: (id: number) => {
        const item = DATA_PICKUP_TIME.find(it => it.id === id);
        setPickupTime(item);
      },
    });
  };

  const onPressOrder = () => {
    const products = data?.items?.map(it => ({
      id: it.productId,
      quantity: it.quantity,
      selectedAttributes: it.selectedAttributes,
    }));
    dispatch(
      createOrderRequest({
        storeId: data?.storeId,
        address: MOCK_ADDRESS,
        note: '',
        products,
        vouchers: [],
        onSuccess: (data: CreateOrderResponse) => {
          AppNavigator.navigate(Paths.OrderCompleted, {
            data,
            dataOrder: {
              deliveryMethod: deliveryTab,
              paymentMethod,
            },
          });
        },
        onFailure: (error: string) => {
          AppNavigator.showSnackBar({
            message: error ?? '',
            type: 'failed',
          });
        },
      }),
    );
  };

  return {
    deliveryTab,
    paymentMethod,
    data,
    pickupTime,
    onPressOrder,
    onPressPickupTime,
    setDeliveryTab,
    setPaymentMethod,
    setPickupTime,
    shippingTabs,
  };
};
