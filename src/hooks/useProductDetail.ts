import type { AttributeDetail, IResponseProductDetail } from '@type/products';

import { useAppDispatch } from '@services/common/storeHooks';
import {
  checkoutProductRequest,
  getProductByIdRequest,
} from '@services/slices/products/productsSlice';
import { useEffect, useMemo, useState } from 'react';
import AppNavigator from '@navigation/AppNavigator';
import { useTranslation } from 'react-i18next';
import {
  getInfoProductCheckoutRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from '@services/slices/payment/paymentSlice';
import { CheckoutInfo } from '@type';
import { groupAttributeItemsByAttributeId } from '@utils/product';

export type { Product } from '@type/products';

type SelectedAttributes = Record<number, number[]>;

export const useProductDetail = (props: any) => {
  const { id: productId } = AppNavigator.getParams(props);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [data, setData] = useState<IResponseProductDetail | undefined>(
    undefined,
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [selectedAttributes, setSelectedAttributes] =
    useState<SelectedAttributes>({});
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo | null>();
  const [refreshCheckoutInfo, setRefreshCheckoutInfo] = useState(false);

  useEffect(() => {
    setQuantity(checkoutInfo?.quantity || 1);
    setSelectedAttributes(
      groupAttributeItemsByAttributeId(checkoutInfo?.selectedAttributes),
    );
  }, [checkoutInfo]);

  useEffect(() => {
    if (!checkoutInfo || checkoutInfo?.quantity > 0) {
      return;
    }
    if (checkoutInfo?.quantity > 0) {
      return;
    }
    const defaults: SelectedAttributes = {};
    for (const attribute of data?.attributes ?? []) {
      if (attribute.type === 'RADIO' && attribute.items.length > 0) {
        defaults[attribute.id] = [attribute.items[0].id];
      }
    }
    setSelectedAttributes(defaults);
  }, [checkoutInfo, data]);

  const minChooseQuantity = useMemo(() => {
    return checkoutInfo?.quantity > 0 ? 0 : 1;
  }, [checkoutInfo]);

  useEffect(() => {}, [data?.attributes, quantity, selectedAttributes]);

  const buttonTextSubmit = useMemo(() => {
    if (checkoutInfo?.quantity > 0) {
      return quantity > 0 ? 'Update cart' : 'Remove to card';
    }
    return t('product_detail.cart_button');
  }, [checkoutInfo, quantity]);

  const totalAmount = useMemo(() => {
    const basePrice = data?.price ?? 0;
    let attributesPrice = 0;
    for (const attribute of data?.attributes ?? []) {
      const selectedIds = selectedAttributes[attribute.id] ?? [];
      for (const item of attribute.items) {
        if (selectedIds.includes(item.id)) {
          attributesPrice += item.price ?? 0;
        }
      }
    }
    return (basePrice + attributesPrice) * quantity;
  }, [data, quantity, selectedAttributes]);

  const handleGetCheckoutInfoSuccess = (data: CheckoutInfo) => {
    setCheckoutInfo(data);
  };
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

    dispatch(
      getInfoProductCheckoutRequest({
        // onFailure: handleFailure,
        onSuccess: handleGetCheckoutInfoSuccess,
        productId,
      }),
    );
  }, [dispatch, productId]);

  useEffect(() => {
    if (productId == null || productId === '') {
      setLoading(false);
      setError('Missing product id');
      return;
    }
    dispatch(
      getInfoProductCheckoutRequest({
        // onFailure: handleFailure,
        onSuccess: handleGetCheckoutInfoSuccess,
        productId,
      }),
    );
  }, [dispatch, productId, refreshCheckoutInfo]);

  const onSelectAttribute = (attribute: AttributeDetail, itemId: number) => {
    setSelectedAttributes(prev => {
      const current = prev[attribute.id] ?? [];
      if (attribute.type === 'RADIO') {
        return { ...prev, [attribute.id]: [itemId] };
      }
      const next = current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId];
      return { ...prev, [attribute.id]: next };
    });
  };

  const onChangeQuantity = (delta: number) => {
    setQuantity(prev => Math.max(0, prev + delta));
  };

  const onPressCart = () => {
    if (quantity == 0) {
      dispatch(
        removeCartItemRequest({
          cartItemId: checkoutInfo?.cartItemId || 0,
          onSuccess: () => {
            AppNavigator.showSnackBar({
              message: 'Remove item successfully',
              type: 'success',
            });
            setCheckoutInfo(prev => ({
              ...prev,
              quantity: 0,
            }));
          },
          onFailure: (message: string) => {
            AppNavigator.showSnackBar({
              message: message || '',
              type: 'failed',
            });
          },
        }),
      );
      return;
    }
    const flatAttributes = Object.values(selectedAttributes)
      .flat()
      .map(attributeItemId => ({ attributeItemId }));
    const actionExecutor =
      checkoutInfo?.quantity > 0
        ? updateCartItemRequest
        : checkoutProductRequest;
    dispatch(
      actionExecutor({
        productId,
        cartItemId: checkoutInfo?.cartItemId,
        quantity: quantity,
        selectedAttributes: flatAttributes,
        // storeId,
        // vouchers: [],
        onSuccess: () => {
          AppNavigator.showSnackBar({
            message: t('product_detail.add_cart_success'),
            type: 'success',
          });
          setRefreshCheckoutInfo(prev => !prev);
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
    data,
    error,
    loading,
    totalAmount,
    buttonTextSubmit,
    minChooseQuantity,
    onChangeQuantity,
    onPressCart,
    onSelectAttribute,
    quantity,
    selectedAttributes,
  };
};
