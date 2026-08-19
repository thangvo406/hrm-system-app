import type { IconName } from '@assets/icons';

import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import InputAddress from '@screens/InputAddress';
import { useEffect, useMemo, useState } from 'react';

export type OrderMethod = 'DELIVERY' | 'HALL' | 'PICKUP';

export type OrderMethodItem = {
  readonly desc: string;
  readonly icon: IconName;
  readonly id: OrderMethod;
  readonly label: string;
};

const ORDER_METHODS: readonly OrderMethodItem[] = [
  {
    desc: 'order_method.method_delivery_desc',
    icon: 'ic_truck',
    id: 'DELIVERY',
    label: 'order_method.method_delivery',
  },
  {
    desc: 'order_method.method_pickup_desc',
    icon: 'ic_shopping_bag',
    id: 'PICKUP',
    label: 'order_method.method_pickup',
  },
  {
    desc: 'order_method.method_dinein_desc',
    icon: 'ic_store',
    id: 'HALL',
    label: 'order_method.method_dinein',
  },
];

export const useOrderShipping = (props: any) => {
  const { addressOrderRecent, data } = AppNavigator.getParams(props);
  const [selected, setSelected] = useState<OrderMethod | string>('');
  const [addressDelivery, setAddressDelivery] = useState(addressOrderRecent);

  const addressDisplay =
    addressDelivery?.address?.roadAddress ||
    addressDelivery?.address?.landAddress ||
    addressDelivery?.address_name;

  const disableBtn = useMemo(() => {
    return !selected || (selected == 'DELIVERY' && !addressDisplay?.length);
  }, [addressDisplay, selected]);

  const orderMethods = useMemo(() => {
    return data?.storeReceiveMethod?.map((item: string) => {
      return ORDER_METHODS?.find(it => it.id == item);
    });
  }, [data]);

  const selectedLabel = ORDER_METHODS.find(it => it.id === selected)?.label;

  useEffect(() => {
    setSelected(prev => (prev ? prev : orderMethods?.[0]?.id));
  }, [orderMethods]);

  const onUpdateAddress = (address: any) => {
    setAddressDelivery(address);
  };

  const onPressMethod = (method: OrderMethod) => () => {
    setSelected(method);
  };

  const onChangeAddress = () => {
    AppNavigator.showDialog({
      addressRecent: addressOrderRecent,
      isFullScreen: true,
      onSubmit: onUpdateAddress,
      screen: InputAddress,
    });
  };

  const onSubmit = () => {
    AppNavigator.navigate(Paths.CartDetail, {
      address: addressDelivery || addressOrderRecent,
      data,
      isShowConfirmPayment: true,
      shipping: selected,
    });
  };

  return {
    addressDisplay,
    data,
    disableBtn,
    onChangeAddress,
    onPressMethod,
    onSubmit,
    orderMethods,
    selected,
    selectedLabel,
  };
};
