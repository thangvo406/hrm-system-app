import Selection from '@dialogs/Selection';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useAppDispatch } from '@services/common/storeHooks';
import { getTotalItemCartRequest } from '@services/slices/account/accountSlice';
import {
  createOrderRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from '@services/slices/payment/paymentSlice';
import type { CreateOrderResponse } from '@type';
import { upperCaseFirstChar } from '@utils/common';
import { debounce } from 'lodash';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { data: dataCart } = AppNavigator.getParams(props);
  const { t } = useTranslation();
  const [data, setData] = useState(dataCart);
  const [deliveryTab, setDeliveryTab] = useState<DeliveryTab>(
    data.storeReceiveMethod?.length > 0
      ? data.storeReceiveMethod[0]
      : undefined,
  );
  const dispatch = useAppDispatch();
  const debounceIdChangeQuanlity = useRef(undefined);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentCartMethod>('coop_pay');
  const [pickupTime, setPickupTime] = useState(PICKUP_DEFAULT);

  const shippingTabs = useMemo(() => {
    return (
      data.storeReceiveMethod?.map(item => {
        return {
          id: item,
          label: upperCaseFirstChar(item.toLowerCase()),
        };
      }) || []
    );
  }, [data]);

  const onPressSelectAddress = () => {
    AppNavigator.navigate(Paths.InputAddress);
  };

  const onChangeQuantity = (product: any) => {
    debounceIdChangeQuanlity.current?.cancel?.();
    debounceIdChangeQuanlity.current = debounce(() => {
      dispatch(
        updateCartItemRequest({
          productId: product?.productId,
          quantity: product?.quantity,
          selectedAttributes: product?.selectedAttributes,
          cartItemId: product?.id,
          onSuccess: (response: any) => {
            if (response?.items?.length == 0) {
              dispatch(
                removeCartItemRequest({
                  cartItemId: response?.id,
                  onSuccess: () => {
                    AppNavigator.showSnackBar({
                      message: t('payment_cart.remove_cart_success'),
                      type: 'success',
                    });
                    dispatch(getTotalItemCartRequest());
                    AppNavigator.goBack();
                  },
                }),
              );
            } else {
              setData(response);
            }
          },
        }),
      );
    }, 350);
    debounceIdChangeQuanlity.current();
  };

  const onRemoveProduct = (cartItemId: number) => {
    dispatch(
      removeCartItemRequest({
        cartItemId,
        onSuccess: () => {
          const newData = { ...data };
          newData.items = newData.items?.filter(
            (it: { id: number }) => it.id !== cartItemId,
          );
          setData(newData);
        },
      }),
    );
  };

  const onPressPickupTime = () => {
    AppNavigator.showDialog({
      screen: Selection,
      title: t('myapp.payment_cart.select_pickup_time'),
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
    onRemoveProduct,
    pickupTime,
    onPressOrder,
    onPressPickupTime,
    setDeliveryTab,
    onPressSelectAddress,
    setPaymentMethod,
    onChangeQuantity,
    setPickupTime,
    shippingTabs,
  };
};
