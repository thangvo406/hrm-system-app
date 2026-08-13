import { AppConstants } from '@constants';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useAppDispatch } from '@services/common/storeHooks';
import { getTotalItemCartRequest } from '@services/slices/account/accountSlice';
import {
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


interface AddressDelivery {
  address: SearchAddressItem;
  detail: string;
  address_name: string;
}

export const useCartDetail = (props: any) => {
  const {
    address,
    cartId,
    data: dataCart,
    isShowConfirmPayment = false,
    shipping,
  } = AppNavigator.getParams(props);
  const { t } = useTranslation();
  const [data, setData] = useState(dataCart);
  const [deliveryTab, setDeliveryTab] = useState<string | undefined>(
    shipping ||
      (data?.storeReceiveMethod?.length > 0
        ? data.storeReceiveMethod[0]
        : undefined),
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
  const [addressDelivery, setAddressDelivery] =
    useState<AddressDelivery>(address);

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
        onSuccess(addressRecent: any) {
          setAddressOrderRecent(addressRecent);
          if (!address) {
            setAddressDelivery(addressRecent);
          }
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
            if (!response?.items?.length) {
              AppNavigator.showSnackBar({
                message: t('payment_cart.remove_cart_success'),
                type: 'success',
              });
              dispatch(getTotalItemCartRequest());
              AppNavigator.goBack();
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

  const onPressPayment = () => {
    const items = products?.map((it: any) => ({
      id: it.productId,
      quantity: it.quantity,
      selectedAttributes: it.selectedAttributes,
    }));
    AppNavigator.navigate(Paths.Payment, {
      payloadRequest: {
        storeId: data?.storeId,
        address: JSON.stringify(
          addressDelivery?.address?.detail || addressDelivery,
        ),
        addressDetail: addressDelivery?.detail || '',
        receiveMethod: deliveryTab,
        products: items,
        totalAmount: data?.subTotal,
        goFrom: 'order_product',
      },
    });
  };

  const onBack = () => {
    AppNavigator.goBack();
  };

  const onPressOrder = () => {
    AppNavigator.navigate(Paths.OrderShipping, {
      addressOrderRecent,
      data,
    });
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
    products,
    isShowConfirmPayment,
    addressDelivery: getAddressDisplay(),
    onPressOrder,
    onBack,
    onPressPayment,
    setDeliveryTab,
    onPressSelectAddress,
    setPaymentMethod,
    onChangeQuantity,
    shippingTabs,
  };
};
