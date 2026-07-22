import { AppConstants } from '@constants';
import Selection from '@dialogs/Selection';
import WebViewScreen from '@dialogs/Webview';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useAppDispatch } from '@services/common/storeHooks';
import { getTotalItemCartRequest } from '@services/slices/account/accountSlice';
import {
  createOrderRequest,
  getAddressOrderRecentRequest,
  getCartDetailRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from '@services/slices/payment/paymentSlice';
import type { SearchAddressItem } from '@type';
import { upperCaseFirstChar } from '@utils/common';
import type { DebouncedFunc } from 'lodash';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter } from 'react-native';

export type UseCartDetail = ReturnType<typeof useCartDetail>;

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
interface AddressDelivery {
  address: SearchAddressItem;
  detail: string;
  address_name: string;
}

export const useCartDetail = (props: any) => {
  const { cartId, data: dataCart } = AppNavigator.getParams(props);
  const { t } = useTranslation();
  const [data, setData] = useState(dataCart);
  const [deliveryTab, setDeliveryTab] = useState<string | undefined>(
    data?.storeReceiveMethod?.length > 0
      ? data.storeReceiveMethod[0]
      : undefined,
  );
  const [loading, setLoading] = useState(!dataCart);
  const [error, setError] = useState('');
  const [addressOrderRecent, setAddressOrderRecent] = useState();
  const dispatch = useAppDispatch();
  const debounceIdChangeQuanlity = useRef<
    DebouncedFunc<() => void> | undefined
  >(undefined);

  const [paymentMethod, setPaymentMethod] = useState<string>(
    AppConstants.PaymentTypes.BALANCE,
  );
  const [pickupTime, setPickupTime] = useState(PICKUP_DEFAULT);
  const [addressDelivery, setAddressDelivery] = useState<AddressDelivery>();

  const shippingTabs = useMemo(() => {
    return (
      data?.storeReceiveMethod?.map((item: string) => {
        return {
          id: item,
          label: upperCaseFirstChar(item.toLowerCase()),
        };
      }) || []
    );
  }, [data]);

  const products = useMemo(() => {
    return data?.items?.filter(
      (it: any) => !it.productDeleted || it.productStatus == 'ACTIVE',
    );
  }, [data]);

  useEffect(() => {
    dispatch(
      getAddressOrderRecentRequest({
        onSuccess(data: any) {
          setAddressDelivery(data);
          setAddressOrderRecent(data);
        },
      }),
    );

    if (!dataCart) {
      dispatch(
        getCartDetailRequest({
          cartId,
          onSuccess: _data => {
            setData(_data);
            setDeliveryTab(
              _data.storeReceiveMethod?.length > 0
                ? _data.storeReceiveMethod[0]
                : undefined,
            );
            setLoading(false);
          },
          onFailure: error => {
            setError(error);
            setLoading(false);
          },
        }),
      );
    }
  }, []);

  useEffect(() => {
    DeviceEventEmitter.addListener(
      AppConstants.UPDATE_ADDRESS_CART_KEY,
      address => {
        setAddressDelivery(address);
      },
    );
  }, []);

  const onPressSelectAddress = () => {
    AppNavigator.navigate(Paths.InputAddress, {
      addressRecent: addressOrderRecent,
    });
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
    debounceIdChangeQuanlity.current?.();
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
      title: t('payment_cart.select_pickup_time'),
      popupType: 'bottomSheet',
      items: DATA_PICKUP_TIME,
      selectedId: pickupTime.id,
      onSelect: (id: number) => {
        const item = DATA_PICKUP_TIME.find(it => it.id === id);
        if (item) {
          setPickupTime(item);
        }
      },
    });
  };

  const handleRedirectPayment = (data: any) => {
    const { kcpInitParams } = data?.responsePayment || {};
    AppNavigator.showDialog({
      screen: WebViewScreen,
      data: {
        siteCd: kcpInitParams?.siteCd,
        orderNo: kcpInitParams?.orderNo,
        amount: kcpInitParams?.reqAmt,
        qtid: kcpInitParams?.qtid,
      },
      url: kcpInitParams?.kcpWebViewUrl,
      isFullScreen: true,
    });
  };
  const onPressOrder = () => {
    const items = products?.map((it: any) => ({
      id: it.productId,
      quantity: it.quantity,
      selectedAttributes: it.selectedAttributes,
    }));
    dispatch(
      createOrderRequest({
        storeId: data?.storeId,
        address: JSON.stringify(addressDelivery?.address?.detail),
        addressDetail: addressDelivery?.detail || '',
        createLinkRequest: {
          payment: {
            paymentType: paymentMethod,
          },
        },
        receiveMethod: deliveryTab,
        products: items,
        vouchers: [],
        onSuccess: (data: any) => {
          const { responsePayment, responseCreateOrder } = data || {};
          if (responsePayment?.requiresRedirect) {
            handleRedirectPayment(data);
          } else {
            AppNavigator.navigate(Paths.OrderCompleted, {
              data: responseCreateOrder,
              dataOrder: {
                deliveryMethod: deliveryTab,
                paymentMethod,
              },
            });
          }
        },
        onFailure: (type: string, error: any) => {
          if (typeof error == 'string') {
            AppNavigator.showSnackBar({
              message: error,
              type: 'failed',
            });
          } else {
            AppNavigator.navigate(Paths.OrderCompleted, {
              data: error,
              status: 'pending',
              dataOrder: {
                deliveryMethod: deliveryTab,
                paymentMethod,
              },
            });
          }
        },
      }),
    );
  };

  const getAddressDisplay = () => {
    return (
      addressDelivery?.address?.roadAddress ||
      addressDelivery?.address?.landAddress ||
      addressDelivery?.address_name
    );
  };

  return {
    deliveryTab,
    paymentMethod,
    data,
    onRemoveProduct,
    loading,
    error,
    pickupTime,
    products,
    addressDelivery: getAddressDisplay(),
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
