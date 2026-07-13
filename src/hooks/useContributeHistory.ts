import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from '@services/common/storeHooks';
import {
  getCurrentWalletRequest,
  getContributeHistoriesRequest,
} from '@services/slices/account/accountSlice';
import {
  getContributeSummaryRequest,
  getHistoriesDividendRequest,
} from '@services/slices/payment/paymentSlice';
import type { ContributeSummary, IDividendHistory } from '@type/payment';
import type { ContributeHistory, ListApiResponse } from '@type';
import { useCallback, useRef, useState } from 'react';

export type PayCardHistoryTab = 'pay' | 'point';

export type PayCardTransaction = {
  readonly amount: string;
  readonly balanceAfter: string;
  readonly date: string;
  readonly description: string;
  readonly id: string;
  readonly type: PayCardHistoryTab;
};

type TabPaginationState = {
  isLast: boolean;
  isLoadingMore: boolean;
  page: number;
};

const INITIAL_PAGINATION: TabPaginationState = {
  isLast: false,
  isLoadingMore: false,
  page: 0,
};

const onRecharge = () => {
  AppNavigator.navigate(Paths.ContributionInput);
};

export const useContributeHistory = () => {
  const [historyTab, setHistoryTab] = useState<PayCardHistoryTab>('pay');
  const dispatch = useAppDispatch();
  const [summary, setSummary] = useState<ContributeSummary | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);

  const [payItems, setPayItems] = useState<ContributeHistory[]>([]);
  const [pointItems, setPointItems] = useState<IDividendHistory[]>([]);

  const payPagination = useRef<TabPaginationState>({ ...INITIAL_PAGINATION });
  const pointPagination = useRef<TabPaginationState>({ ...INITIAL_PAGINATION });

  const getPagination = useCallback(
    (tab: PayCardHistoryTab) =>
      tab === 'pay' ? payPagination : pointPagination,
    [],
  );

  const fetchTab = useCallback(
    (tab: PayCardHistoryTab, page: number) => {
      const pagination = getPagination(tab);

      if (tab === 'pay') {
        dispatch(
          getContributeHistoriesRequest({
            balanceAccountType: 'CONTRIBUTION',
            page,
            size: 20,
            onSuccess: (data: ListApiResponse<ContributeHistory[]>) => {
              pagination.current.isLast = data.last;
              pagination.current.isLoadingMore = false;
              setPayItems(prev =>
                page === 0 ? data.content : [...prev, ...data.content],
              );
              setLoading(false);
            },
            onFailure: () => {
              pagination.current.isLoadingMore = false;
              setLoading(false);
            },
          }),
        );
      } else {
        dispatch(
          getHistoriesDividendRequest({
            page,
            size: 20,
            onSuccess: (data: ListApiResponse<IDividendHistory[]>) => {
              pagination.current.isLast = data.last;
              pagination.current.isLoadingMore = false;
              setPointItems(prev =>
                page === 0 ? data.content : [...prev, ...data.content],
              );
              setLoading(false);
            },
            onFailure: () => {
              pagination.current.isLoadingMore = false;
              setLoading(false);
            },
          }),
        );
      }
    },
    [dispatch, getPagination],
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(getCurrentWalletRequest());
      dispatch(
        getContributeSummaryRequest({
          onSuccess: data => setSummary(data),
          onFailure: () => setSummary(undefined),
        }),
      );
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchTab(historyTab, getPagination(historyTab).current.page);
    }, [historyTab, fetchTab, getPagination]),
  );

  const onLoadMore = useCallback(() => {
    const pagination = getPagination(historyTab);
    if (pagination.current.isLast || pagination.current.isLoadingMore) return;
    pagination.current.isLoadingMore = true;
    const nextPage = pagination.current.page + 1;
    pagination.current.page = nextPage;
    fetchTab(historyTab, nextPage);
  }, [historyTab, fetchTab, getPagination]);

  const onChangeTab = useCallback(
    (tab: PayCardHistoryTab) => {
      setHistoryTab(tab);
      getPagination(tab).current = { ...INITIAL_PAGINATION };
    },
    [getPagination],
  );

  const onPressTranItem = useCallback((item: any) => {
    AppNavigator.navigate(Paths.ContributeHistoryDetail, { id: item.id });
  }, []);

  return {
    historyTab,
    loading,
    onChangeTab,
    onLoadMore,
    onPressTranItem,
    onRecharge,
    pointTransactions: pointItems,
    summary,
    tranHistories: payItems,
  };
};
