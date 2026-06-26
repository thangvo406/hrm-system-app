import type { OrderHistoryItem } from '@type/payment';
import type { ListApiResponse } from '@type';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppDispatch } from '@services/common/storeHooks';
import { getOrderHistoriesRequest } from '@services/slices/payment/paymentSlice';

const PAGE_SIZE = 10;

function onReorder() {
  // navigate to reorder flow
}

function onRate() {
  // navigate to rate flow
}

export function useOrderHistories() {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const handleSuccess = (response: ListApiResponse<OrderHistoryItem[]>) => {
    isLast.current = response.last;
    setLoading(false);
    setData(prev => {
      isLoadingMore.current = false;
      return currentPage === 0
        ? response.content
        : [...(prev ?? []), ...response.content];
    });
  };

  const handleFailure = (message: string) => {
    setError(message);
    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      getOrderHistoriesRequest({
        page: currentPage,
        size: PAGE_SIZE,
        onFailure: handleFailure,
        onSuccess: handleSuccess,
      }),
    );
  }, [dispatch, currentPage]);

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) return;
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  return {
    data,
    error,
    loading,
    onLoadMore,
    onRate,
    onReorder,
  };
}
