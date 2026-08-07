import type { ListApiResponse } from '@type/common';
import type { IPointExpiryItem } from '@type/wallet';

import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { getPointExpiringRequest } from '@services/slices/account/accountSlice';
import { useCallback, useEffect, useRef, useState } from 'react';

const EXPIRING_WINDOW_DAYS = 30;
const PAGE_SIZE = 10;

const getNearestExpiryDate = (items: IPointExpiryItem[]) => {
  let nearest: string | undefined;
  for (const item of items) {
    if (nearest === undefined || item.expiresOn < nearest) {
      nearest = item.expiresOn;
    }
  }
  return nearest;
};

const onUsePoint = () => {
  AppNavigator.navigate(Paths.PayPointHistories);
};

export const usePointExpiring = () => {
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const [items, setItems] = useState<IPointExpiryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const handleSuccess = (data: ListApiResponse<IPointExpiryItem[]>) => {
    // isLast.current = data.last;
    isLast.current = true;
    setLoading(false);
    // setItems(previous => {
    //   const results =
    //     currentPage === 0
    //       ? data?.content
    //       : [...(previous || []), ...(data?.content || [])];
    //   isLoadingMore.current = false;
    //   return results;
    // });
    setItems(previous => {
      const results =
        currentPage === 0
          ? data?.schedule
          : [...(previous || []), ...(data?.schedule || [])];
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
    loading,
    nearestExpiryDate: getNearestExpiryDate(items),
    onLoadMore,
    onUsePoint,
    totalAmount: currentWallet?.expiringPointBalance ?? 0,
  };
};
