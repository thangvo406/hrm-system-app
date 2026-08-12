import type { IOrderHistoryItem } from '@type/payment';
import type { ListApiResponse } from '@type';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppDispatch } from '@services/common/storeHooks';
import { getOrderHistoriesRequest } from '@services/slices/payment/paymentSlice';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';

const PAGE_SIZE = 10;

export type OrderTabKey = 'all' | 'pickup' | 'hall';

export const ORDER_RECEIVE_METHODS: Record<OrderTabKey, string> = {
  all: '',
  hall: 'hall',
  pickup: 'pickup',
};

function onPressItem(item: any) {
  AppNavigator.navigate(Paths.OrderHistoryDetail, { data: item });
}

export function useOrders() {
  const dispatch = useAppDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<OrderTabKey>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);
  const timoutLoadMore = useRef(false);

  const handleSuccess = (response: ListApiResponse<IOrderHistoryItem[]>) => {
    isLast.current = response.last;
    setLoading(false);
    setData(prev => {
      isLoadingMore.current = false;
      return currentPage === 0
        ? response.content
        : [...(prev ?? []), ...response.content];
    });
  };

  const onReOrder = (item: any) => {
    //   dispatch(checkoutProductRequest({
    //      productId: number;
    // quantity: number;
    //       selectedAttributes: AttributeCheckout[];
    //   }))
  };
  const handleFailure = (message: string) => {
    setError(message);
    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      getOrderHistoriesRequest({
        orderReceiveMethod: ORDER_RECEIVE_METHODS[activeTab],
        page: currentPage,
        size: PAGE_SIZE,
        onFailure: handleFailure,
        onSuccess: handleSuccess,
      }),
    );
  }, [dispatch, activeTab, currentPage]);

  const onLoadMore = useCallback(() => {
    clearTimeout(timoutLoadMore.current);
    timoutLoadMore.current = setTimeout(() => {
      if (isLast.current || isLoadingMore.current) return;
      isLoadingMore.current = true;
      setCurrentPage(prev => prev + 1);
    }, 350);
  }, [currentPage]);

  const onChangeTab = (tab: OrderTabKey) => {
    if (tab === activeTab) return;
    setLoading(true);
    isLast.current = false;
    setActiveTab(tab);
    setCurrentPage(0);
  };

  return {
    activeTab,
    data,
    error,
    loading,
    onChangeTab,
    onLoadMore,
    onReOrder,
    onPressItem,
  };
}
