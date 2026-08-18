import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import {
  getPayPointHistoriesRequest,
  getPointExpiringSummaryRequest,
} from '@services/slices/account/accountSlice';
import { IPointExpirySummary, IPointPayHistory, ListApiResponse } from '@type';
import { useCallback, useEffect, useRef, useState } from 'react';

export type TPointHistoryType = 'accrue' | 'expire' | 'use';

const HISTORIES_PAGE_SIZE = 10;

type THistoryPagination = {
  isLast: boolean;
  isLoadingMore: boolean;
  loaded: boolean;
  page: number;
};

const INITIAL_HISTORY_PAGINATION: THistoryPagination = {
  isLast: false,
  isLoadingMore: false,
  loaded: false,
  page: 0,
};

const onUsePoint = () => {
  AppNavigator.navigate(Paths.PaymentOffline);
};

const onViewExpireDetail = () => {
  AppNavigator.navigate(Paths.PointExpiring);
};

const onPressItemHistory = (item: any) => () => {
  // AppNavigator.navigate(Paths.TransactionDetail, { transId: item?.id });
};
const onViewAllHistory = () => {
  AppNavigator.navigate(Paths.PayPointHistories);
};

const onLegacyLookup = () => {
  AppNavigator.navigate(Paths.PayPointHistories);
};

const useHistories = () => {
  const dispatch = useAppDispatch();
  const [histories, setHistories] = useState<IPointPayHistory[]>([]);
  const [loadingHistories, setLoadingHistories] = useState(true);
  const [loadingMoreHistories, setLoadingMoreHistories] = useState(false);
  const historyPagination = useRef<THistoryPagination>({
    ...INITIAL_HISTORY_PAGINATION,
  });

  const fetchHistories = useCallback(
    (page: number) => {
      dispatch(
        getPayPointHistoriesRequest({
          balanceAccountType: 'POINT',
          onFailure: () => {
            historyPagination.current.isLoadingMore = false;
            setLoadingHistories(false);
            setLoadingMoreHistories(false);
          },
          onSuccess: (data: ListApiResponse<IPointPayHistory[]>) => {
            historyPagination.current.isLast = data.last;
            historyPagination.current.isLoadingMore = false;
            historyPagination.current.loaded = true;
            historyPagination.current.page = page;
            setHistories(prev =>
              page === 0
                ? data?.content || []
                : [...prev, ...(data?.content || [])],
            );
            setLoadingHistories(false);
            setLoadingMoreHistories(false);
          },
          page,
          size: HISTORIES_PAGE_SIZE,
        }),
      );
    },
    [dispatch],
  );

  // `loaded` keeps FlatList's initial onEndReached from fetching page 1 before
  // page 0 has come back.
  const onLoadMoreHistories = useCallback(() => {
    const pagination = historyPagination.current;
    if (!pagination.loaded || pagination.isLast || pagination.isLoadingMore) {
      return;
    }
    pagination.isLoadingMore = true;
    setLoadingMoreHistories(true);
    fetchHistories(pagination.page + 1);
  }, [fetchHistories]);

  useFocusEffect(
    useCallback(() => {
      historyPagination.current = { ...INITIAL_HISTORY_PAGINATION };
      setLoadingHistories(true);
      fetchHistories(0);
    }, [fetchHistories]),
  );

  return {
    histories,
    loadingHistories,
    loadingMoreHistories,
    onLoadMoreHistories,
  };
};

export const usePointDashboard = () => {
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const dispatch = useAppDispatch();
  const [summary, setSummary] = useState<IPointExpirySummary>();
  const historiesState = useHistories();

  useEffect(() => {
    dispatch(
      getPointExpiringSummaryRequest({
        // onFailure: handleFailure,
        onSuccess: data => setSummary(data),
      }),
    );
  }, [dispatch]);

  return {
    balance: currentWallet?.pointBalance,
    expiringAmount: currentWallet?.expiringPointBalance,
    summary,
    onLegacyLookup,
    onPressItemHistory,
    onUsePoint,
    onViewAllHistory,
    onViewExpireDetail,
    ...historiesState,
  };
};
