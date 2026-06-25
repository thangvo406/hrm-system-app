import Selection from '@dialogs/Selection';
import AppNavigator from '@navigation/AppNavigator';
import { upperCaseFirstChar } from '@utils/common';
import { useEffect, useMemo, useState } from 'react';

export type DeliveryTab = 'DELIVERY' | 'PICKUP';
export type PaymentCartMethod = 'coop_pay' | 'credit_card' | 'easy_payment';

export type UsePaymentCart = ReturnType<typeof usePaymentCart>;

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
  }, []);

  const onPressPickupTime = () => {
    AppNavigator.showDialog({
      screen: Selection,
      title: 'Select Pickup Time',
      popupType: 'bottomSheet',
      items: DATA_PICKUP_TIME,
      selectedId: pickupTime.id,
      onSelect: (id: number) => {
        const item = DATA_PICKUP_TIME.find(it => it.id == id);
        setPickupTime(item);
      },
    });
  };

  return {
    deliveryTab,
    paymentMethod,
    data,
    pickupTime,
    onPressPickupTime,
    setDeliveryTab,
    setPaymentMethod,
    setPickupTime,
    shippingTabs,
  };
};
