import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from '@services/common/storeHooks';
import {
  getCurrentWalletRequest,
  getContributeHistoriesRequest,
} from '@services/slices/account/accountSlice';
import { getContributeSummaryRequest } from '@services/slices/payment/paymentSlice';
import type { ContributeSummary } from '@type/payment';
import type {
  ContributeHistory,
  ListApiResponse,
  TransactionHistory,
} from '@type';
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

const onRecharge = () => {
  AppNavigator.navigate(Paths.ContributionInput);
};

export const useContributeHistory = () => {
  const [historyTab, setHistoryTab] = useState<PayCardHistoryTab>('pay');
  const dispatch = useAppDispatch();
  const [summary, setSummary] = useState<ContributeSummary | undefined>(
    undefined,
  );

  const [pointTransactions, setPointTransactions] =
    useState<TransactionHistory[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const [tranHistories, setTranHistories] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const handleGetTranSuccess = (data: ListApiResponse<ContributeHistory[]>) => {
    isLast.current = data.last;
    setLoading(false);
    const executor =
      historyTab === 'pay' ? setTranHistories : setPointTransactions;
    executor((prev: any) => {
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
      dispatch(getCurrentWalletRequest());
      dispatch(
        getContributeSummaryRequest({
          onSuccess: data => {
            setSummary(data);
          },
          onFailure: () => {
            setSummary(undefined);
          },
        }),
      );
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const balanceAccountType = historyTab === 'pay' ? 'PAY_MONEY' : 'POINT';
      dispatch(
        getContributeHistoriesRequest({
          page: currentPage,
          size: 20,
          balanceAccountType,
          onSuccess: handleGetTranSuccess,
          onFailure: () => {
            setLoading(false);
          },
        }),
      );
    }, [currentPage, historyTab]),
  );

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  const onPressTranItem = useCallback((item: any) => {
    AppNavigator.navigate(Paths.ContributeHistoryDetail, { id: item.id });
  }, []);

  const onChangeTab = (tab: any) => {
    setHistoryTab(tab);
    setCurrentPage(0);
  };

  return {
    historyTab,
    loading,
    summary,
    onLoadMore,
    onPressTranItem,
    onRecharge,
    tranHistories,
    pointTransactions,
    onChangeTab,
  };
};
