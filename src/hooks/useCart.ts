import type { IStoreCartItem } from '@type/payment';
import type { ListApiResponse } from '@type/common';

import { useAppDispatch } from '@services/common/storeHooks';
import {
  getListCartRequest,
  removeCartItemRequest,
} from '@services/slices/payment/paymentSlice';
import { useCallback, useMemo, useRef, useState } from 'react';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { getTotalItemCartRequest } from '@services/slices/account/accountSlice';

const PAGE_SIZE = 20;

export const useCart = () => {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<IStoreCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isManaging, setIsManaging] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);
  const { t } = useTranslation();

  const titleManageCart = useMemo(() => {
    if (!(items?.length > 0)) {
      return '';
    }
    return isManaging ? t('carts.done') : t('carts.manage');
  }, [isManaging, items]);

  const handleSuccess = (data: ListApiResponse<IStoreCartItem[]>) => {
    isLast.current = data.last;
    setLoading(false);
    setItems(prev => {
      let results = [];
      results =
        currentPage != 0
          ? (prev || [])?.concat?.(data?.content)
          : data?.content;
      isLoadingMore.current = false;
      return results;
    });
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      dispatch(
        getListCartRequest({
          page: 0,
          size: PAGE_SIZE,
          onSuccess: handleSuccess,
          onFailure: () => {
            setLoading(false);
          },
        }),
      );
    }, [dispatch]),
  );

  const onToggleManage = () => {
    setIsManaging(prev => !prev);
  };

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  const onRemoveItem = (cartItemId: number) => {
    dispatch(
      removeCartItemRequest({
        cartItemId,
        onSuccess: () => {
          setItems(prev => {
            const newData = prev.filter(item => item.id !== cartItemId);
            dispatch(getTotalItemCartRequest());
            setItems(newData);
          });
          AppNavigator.showSnackBar({
            message: t('carts.remove_success'),
            type: 'success',
          });
        },
        onFailure: (message: string) => {
          AppNavigator.showSnackBar({ message: message || '', type: 'failed' });
        },
      }),
    );
  };

  const onPressItem = (item: IStoreCartItem) => {
    AppNavigator.navigate(Paths.PaymentCart, {
      data: item,
    });
  };

  return {
    isManaging,
    items,
    loading,
    titleManageCart,
    onRemoveItem,
    onToggleManage,
    onLoadMore,
    onPressItem,
  };
};
