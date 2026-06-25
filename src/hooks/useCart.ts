import type { StoreCartItem } from '@type/payment';
import type { ListApiResponse } from '@type/common';

import { useAppDispatch } from '@services/common/storeHooks';
import {
  getListCartRequest,
  removeCartItemRequest,
} from '@services/slices/payment/paymentSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';

const PAGE_SIZE = 20;

export const useCart = () => {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<StoreCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isManaging, setIsManaging] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const handleSuccess = (data: ListApiResponse<StoreCartItem[]>) => {
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

  useEffect(() => {
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
  }, [dispatch]);

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
          setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
          AppNavigator.showSnackBar({
            message: 'Đã xóa sản phẩm',
            type: 'success',
          });
        },
        onFailure: (message: string) => {
          AppNavigator.showSnackBar({ message: message || '', type: 'failed' });
        },
      }),
    );
  };

  const onPressItem = (item: StoreCartItem) => {
    AppNavigator.navigate(Paths.PaymentCart, {
      data: item,
    });
  };

  return {
    isManaging,
    items,
    loading,
    onRemoveItem,
    onToggleManage,
    onLoadMore,
    onPressItem,
  };
};
