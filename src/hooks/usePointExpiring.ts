import type { ListApiResponse } from '@type/common';
import { IPointExpirySummary, type IPointExpiryItem } from '@type/wallet';

import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useAppDispatch } from '@services/common/storeHooks';
import {
  getPointExpiringRequest,
  getPointExpiringSummaryRequest,
} from '@services/slices/account/accountSlice';
import { useCallback, useEffect, useRef, useState } from 'react';

const EXPIRING_WINDOW_DAYS = 30;
const PAGE_SIZE = 10;

const onUsePoint = () => {
  AppNavigator.navigate(Paths.PaymentOffline);
};

export const usePointExpiring = () => {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<IPointExpiryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);
  const [summary, setSummary] = useState<IPointExpirySummary>();

  const handleSuccess = (data: ListApiResponse<IPointExpiryItem[]>) => {
    isLast.current = data.last;
    setLoading(false);
    setItems(previous => {
      const results =
        currentPage === 0
          ? data?.content
          : [...(previous || []), ...(data?.content || [])];
      isLoadingMore.current = false;
      return results;
    });
  };

  const handleFailure = (message: string) => {
    isLoadingMore.current = false;
    setError(message);
    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      getPointExpiringRequest({
        onFailure: handleFailure,
        onSuccess: handleSuccess,
        page: currentPage,
        size: PAGE_SIZE,
      }),
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(
      getPointExpiringSummaryRequest({
        onFailure: handleFailure,
        onSuccess: data => setSummary(data),
      }),
    );
  }, [dispatch]);

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(previous => previous + 1);
  }, []);

  return {
    error,
    expiringWindowDays: EXPIRING_WINDOW_DAYS,
    items,
    summary,
    loading,
    onLoadMore,
    onUsePoint,
  };
};
