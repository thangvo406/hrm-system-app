import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import {
  getCurrentWalletRequest,
  getTransactionHistoriesRequest,
} from '@services/slices/account/accountSlice';
import { ListApiResponse, TransactionHistory } from '@type';
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

const MOCK_PAY_BALANCE = '100,000';
const MOCK_POINT_BALANCE = '11,000';

const MOCK_POINT_TRANSACTIONS: readonly PayCardTransaction[] = [
  {
    amount: '-500 point',
    balanceAfter: '11,000',
    date: '2026-04-12 09:30AM',
    description: '포인트 사용',
    id: 'point-1',
    type: 'point',
  },
  {
    amount: '+1,000 point',
    balanceAfter: '11,500',
    date: '2026-04-11 03:15PM',
    description: '포인트 적립',
    id: 'point-2',
    type: 'point',
  },
];

const onRecharge = () => {
  AppNavigator.navigate(Paths.TopUp);
};

export const usePayCard = () => {
  const [historyTab, setHistoryTab] = useState<PayCardHistoryTab>('pay');
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);

  const payBalance = MOCK_PAY_BALANCE;
  const pointBalance = MOCK_POINT_BALANCE;
  const [currentPage, setCurrentPage] = useState(0);
  const [tranHistories, setTranHistories] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const handleGetTranSuccess = (
    data: ListApiResponse<TransactionHistory[]>,
  ) => {
    isLast.current = data.last;
    setLoading(false);
    setTranHistories(prev => {
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
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(
        getTransactionHistoriesRequest({
          page: currentPage,
          size: 20,
          // transactionType: 'CREDIT',
          onSuccess: handleGetTranSuccess,
          // onFailure: (message) => { ... },
        }),
      );
    }, [currentPage]),
  );

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  const payTransactions = tranHistories;
  const pointTransactions = MOCK_POINT_TRANSACTIONS;

  return {
    currentWallet,
    historyTab,
    loading,
    onLoadMore,
    onRecharge,
    payBalance,
    payTransactions,
    pointBalance,
    pointTransactions,
    setHistoryTab,
  };
};
