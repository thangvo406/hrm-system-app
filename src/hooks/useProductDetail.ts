/* eslint-disable react-hooks/set-state-in-effect */
import type {
  AttributeCheckout,
  IAttributeDetail,
  IResponseProductDetail,
  ISelectedAttributeItem,
} from '@type/products';

import { useAppDispatch } from '@services/common/storeHooks';
import {
  checkoutProductRequest,
  getProductByIdRequest,
} from '@services/slices/products/productsSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AppNavigator from '@navigation/AppNavigator';
import { useTranslation } from 'react-i18next';
import {
  getInfoProductCheckoutRequest,
  updateCartItemRequest,
} from '@services/slices/payment/paymentSlice';
import { getTotalItemCartRequest } from '@services/slices/account/accountSlice';
import { ICheckoutInfo } from '@type';
import { groupAttributeItemsByAttributeId } from '@utils/product';
import { useFocusEffect } from '@react-navigation/native';
import isNumber from 'lodash/isNumber';
import { Paths } from '@navigation/paths';
import { AttributeType } from '@constants/config';

export type { IProduct } from '@type/products';

type SelectedAttributes = Record<number, ISelectedAttributeItem[]>;

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
  const [checkoutInfo, setCheckoutInfo] = useState<ICheckoutInfo | null>();

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
        defaults[attribute.id] = [
          { itemId: attribute.items[0].id, quantity: 1 },
        ];
      }
    }
    setSelectedAttributes(defaults);
  }, [checkoutInfo, data]);

  const minChooseQuantity = useMemo(() => {
    return (checkoutInfo?.quantity || 0) > 0 ? 0 : 1;
  }, [checkoutInfo]);

  useEffect(() => {}, [data?.attributes, quantity, selectedAttributes]);

  const buttonTextSubmit = useMemo(() => {
    if ((checkoutInfo?.quantity || 0) > 0) {
      return quantity > 0
        ? t('product_detail.update_cart')
        : t('product_detail.remove_cart');
    }
    return t('product_detail.cart_button');
  }, [checkoutInfo, quantity, t]);

  const totalAmount = useMemo(() => {
    const basePrice = isNumber(data?.discountPrice)
      ? data?.discountPrice
      : data?.sellingPrice || 0;
    let attributesPrice = 0;
    for (const attribute of data?.attributes ?? []) {
      const selectedItems = selectedAttributes[attribute.id] ?? [];
      for (const item of attribute.items) {
        const selected = selectedItems.find(entry => entry.itemId === item.id);
        if (selected) {
          attributesPrice += (item.price ?? 0) * selected.quantity;
        }
      }
    }
    return (basePrice + attributesPrice) * quantity;
  }, [data, quantity, selectedAttributes]);

  const handleGetCheckoutInfoSuccess = (data: ICheckoutInfo) => {
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
    if (!productId) {
      setLoading(false);
      setError(t('product_detail.missing_product_id'));
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
  }, [dispatch, productId, t]);

  useFocusEffect(
    useCallback(() => {
      if (productId == undefined || productId === '') {
        setLoading(false);
        setError(t('product_detail.missing_product_id'));
        return;
      }
      dispatch(
        getInfoProductCheckoutRequest({
          // onFailure: handleFailure,
          onSuccess: handleGetCheckoutInfoSuccess,
          productId,
        }),
      );
    }, [dispatch, productId, t]),
  );

  const onSelectAttribute = (
    attribute: IAttributeDetail,
    itemId: number,
    quantity = 1,
  ) => {
    setSelectedAttributes(prev => {
      const current = prev[attribute.id] ?? [];

      // SINGLE: single choice — replace whatever is selected.
      if (attribute.type === AttributeType.SINGLE) {
        return { ...prev, [attribute.id]: [{ itemId, quantity: 1 }] };
      }

      const isSelected = current.some(entry => entry.itemId === itemId);

      // QUANTITY: MULTIPLE_ONCE toggle behaviour, but each item carries a
      // quantity from the param and the attribute's total is capped by
      // maxQuantity — if adding would exceed it, ignore the change.
      if (attribute.type === AttributeType.MULTIPLE_CHOICE) {
        if (isSelected) {
          return {
            ...prev,
            [attribute.id]: current.filter(entry => entry.itemId !== itemId),
          };
        }
        const totalQuantity =
          current.reduce((sum, entry) => sum + entry.quantity, 0) + quantity;
        if (totalQuantity > attribute.maxQuantity) {
          return prev;
        }
        return { ...prev, [attribute.id]: [...current, { itemId, quantity }] };
      }

      // MULTIPLE_ONCE: plain toggle (quantity always 1).
      const next = isSelected
        ? current.filter(entry => entry.itemId !== itemId)
        : [...current, { itemId, quantity: 1 }];
      return { ...prev, [attribute.id]: next };
    });
  };

  const onChangeQuantity = (delta: number) => {
    setQuantity(prev => Math.max(0, prev + delta));
  };

  const updateCountCart = () => {
    dispatch(getTotalItemCartRequest());
  };

  const onPressCart = () => {
    const flatAttributes = Object.values(selectedAttributes)
      .flat()
      .map(
        ({ itemId, quantity }) =>
          ({ attributeItemId: itemId, quantity }) as AttributeCheckout,
      );
    if (quantity == 0) {
      dispatch(
        updateCartItemRequest({
          quantity,
          productId,
          selectedAttributes: flatAttributes,
          cartItemId: checkoutInfo?.cartItemId || 0,
          onSuccess: () => {
            AppNavigator.showSnackBar({
              message: t('product_detail.remove_cart_success'),
              type: 'success',
            });
            setCheckoutInfo(prev => (prev ? { ...prev, quantity: 0 } : prev));
            updateCountCart();
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

    const actionExecutor =
      (checkoutInfo?.quantity || 0) > 0
        ? updateCartItemRequest
        : checkoutProductRequest;
    dispatch(
      actionExecutor({
        productId,
        cartItemId: checkoutInfo?.cartItemId || 0,
        quantity: quantity,
        selectedAttributes: flatAttributes,
        onSuccess: response => {
          const item = response?.items?.find(it => it.productId == data?.id);
          const cartInfo = {
            cartItemId: item?.id,
            quantity: item?.quantity,
            selectedAttributes: item?.selectedAttributes,
          };
          AppNavigator.showSnackBar({
            message: t('product_detail.add_cart_success'),
            type: 'success',
          });
          dispatch(getTotalItemCartRequest());
          if (AppNavigator.getPreviousRoute().name == Paths.Products) {
            AppNavigator.goBack({ cartInfo, productId: data?.id });
          } else {
            AppNavigator.replace(Paths.Products, {
              storeId: data?.storeId,
            });
          }
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
