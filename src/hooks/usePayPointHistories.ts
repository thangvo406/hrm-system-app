import type { IContributeHistory } from '@type/wallet';
import type { ListApiResponse } from '@type/common';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import {
  getCurrentWalletRequest,
  getPayPointHistoriesRequest,
} from '@services/slices/account/accountSlice';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { IPointPayHistory } from '@type';

const PAGE_SIZE = 20;

export type TPayPointTab = 'payMoney' | 'point';

export type TPayPointTagType =
  | 'accrue'
  | 'event'
  | 'expire'
  | 'use'
  | 'welfare';

export type TPayPointUnit = 'point' | 'won';

export type TPayPointAmountTone = 'negative' | 'neutral' | 'positive';


const BALANCE_ACCOUNT_TYPES: Record<TPayPointTab, string> = {
  payMoney: 'PAY_MONEY',
  point: 'POINT',
};

type TPaginationState = {
  isLast: boolean;
  isLoadingMore: boolean;
  loaded: boolean;
  page: number;
};

const INITIAL_PAGINATION: TPaginationState = {
  isLast: false,
  isLoadingMore: false,
  loaded: false,
  page: 0,
};

const EMPTY_HISTORIES: Record<TPayPointTab, IPointPayHistory[]> = {
  payMoney: [],
  point: [],
};

const resolveTag = (type: string, isPositive: boolean): TPayPointTagType => {
  const upperType = type?.toUpperCase() ?? '';
  if (upperType.includes('EXPIRE')) {
    return 'expire';
  }
  if (upperType.includes('EVENT')) {
    return 'event';
  }
  if (upperType.includes('WELFARE')) {
    return 'welfare';
  }
  return isPositive ? 'accrue' : 'use';
};

const toPayPointHistory = (
  item: IContributeHistory,
  tab: TPayPointTab,
): IPayPointHistory => {
  // The ledger's `amount` can come back unsigned; the balance delta is the
  // actual signed change, so prefer it when the two disagree.
  const delta = item.balanceAfter - item.balanceBefore;
  const amount = delta === 0 ? item.amount : delta;
  return {
    amount,
    amountTone: amount > 0 ? 'positive' : amount < 0 ? 'negative' : 'neutral',
    balance: item.balanceAfter,
    dateTime: item.occurredAt,
    description: item.displayType || item.type,
    id: String(item.id),
    tag: resolveTag(item.type, amount > 0),
    unit: tab === 'point' ? 'point' : 'won',
  };
};

export const usePayPointHistories = () => {
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const [activeTab, setActiveTab] = useState<TPayPointTab>('payMoney');
  const [histories, setHistories] =
    useState<Record<TPayPointTab, IPointPayHistory[]>>(EMPTY_HISTORIES);
  const [loadedTabs, setLoadedTabs] = useState<ReadonlySet<TPayPointTab>>(
    () => new Set(),
  );
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const requestedTabs = useRef<Set<TPayPointTab>>(new Set());
  const paginations = useRef<Record<TPayPointTab, TPaginationState>>({
    payMoney: { ...INITIAL_PAGINATION },
    point: { ...INITIAL_PAGINATION },
  });

  const fetchHistories = useCallback(
    (tab: TPayPointTab, page: number) => {
      const pagination = paginations.current[tab];
      dispatch(
        getPayPointHistoriesRequest({
          balanceAccountType: BALANCE_ACCOUNT_TYPES[tab],
          onFailure: () => {
            pagination.isLoadingMore = false;
            setRefreshing(false);
            setLoadingMore(false);
          },
          onSuccess: (data: ListApiResponse<IPointPayHistory[]>) => {
            // const content = (data.content ?? []).map(item =>
            //   toPayPointHistory(item, tab),
            // );
            pagination.isLast = data.last;
            pagination.isLoadingMore = false;
            pagination.loaded = true;
            pagination.page = page;
            setHistories(prev => ({
              ...prev,
              [tab]: page === 0 ? data?.content : [...prev[tab], ...data.content],
            }));
            setLoadedTabs(prev => new Set(prev).add(tab));
            setRefreshing(false);
            setLoadingMore(false);
          },
          page,
          size: PAGE_SIZE,
        }),
      );
    },
    [dispatch],
  );

  const loadHistories = useCallback(
    (tab: TPayPointTab, force = false) => {
      // Skip if already fetched, unless a refresh forces a reload.
      if (!force && requestedTabs.current.has(tab)) {
        return;
      }
      requestedTabs.current.add(tab);
      paginations.current[tab] = { ...INITIAL_PAGINATION };
      fetchHistories(tab, 0);
    },
    [fetchHistories],
  );

  useEffect(() => {
    loadHistories(activeTab);
  }, [activeTab, loadHistories]);

  const isFirstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      dispatch(getCurrentWalletRequest());
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }

      requestedTabs.current.clear();
      loadHistories(activeTab, true);
    }, [activeTab, dispatch, loadHistories]),
  );

  const onChangeTab = useCallback((tab: TPayPointTab) => {
    // Reset the shared load-more flag so a switched-to tab doesn't inherit
    // the previous tab's footer spinner.
    setLoadingMore(false);
    setActiveTab(tab);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getCurrentWalletRequest());
    loadHistories(activeTab, true);
  }, [activeTab, dispatch, loadHistories]);

  const onLoadMore = useCallback(() => {
    const pagination = paginations.current[activeTab];
    // Ignore the mount-time onEndReached (short list) until the first page
    // has actually loaded, and skip when there is nothing more / already busy.
    if (!pagination.loaded || pagination.isLast || pagination.isLoadingMore) {
      return;
    }
    pagination.isLoadingMore = true;
    setLoadingMore(true);
    fetchHistories(activeTab, pagination.page + 1);
  }, [activeTab, fetchHistories]);

  const onPressWithdrawal = useCallback(() => {
    AppNavigator.navigate(Paths.Withdrawal);
  }, []);

  return {
    activeTab,
    currentWallet,
    loading: !loadedTabs.has(activeTab),
    loadingMore,
    onChangeTab,
    onLoadMore,
    onPressWithdrawal,
    onRefresh,
    payMoneyHistories: histories.payMoney,
    pointHistories: histories.point,
    refreshing,
  };
};
