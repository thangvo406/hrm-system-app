import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from '@services/common/storeHooks';
import {
  getCurrentWalletRequest,
  getContributeHistoriesRequest,
} from '@services/slices/account/accountSlice';
import {
  getContributeHistoryDetailRequest,
  getContributeSummaryRequest,
  getDividendDetailRequest,
  getHistoriesDividendRequest,
} from '@services/slices/payment/paymentSlice';
import type { IContributeHistoryDetail, IContributeSummary } from '@type/wallet';
import type {
  IDividendHistory,
  IContributeHistory,
  ListApiResponse,
} from '@type';
import { useCallback, useRef, useState } from 'react';
import ContributionDetail from '@dialogs/ContributionDetail';
import { useTranslation } from 'react-i18next';

type TPayCardHistoryTab = 'pay' | 'point';

type TTabPaginationState = {
  isLast: boolean;
  isLoadingMore: boolean;
  page: number;
};

const INITIAL_PAGINATION: TTabPaginationState = {
  isLast: false,
  isLoadingMore: false,
  page: 0,
};

const onRecharge = () => {
  AppNavigator.navigate(Paths.ContributionInput);
};

export const useContributeHistory = () => {
  const [historyTab, setHistoryTab] = useState<TPayCardHistoryTab>('pay');
  const dispatch = useAppDispatch();
  const [summary, setSummary] = useState<IContributeSummary | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [payItems, setPayItems] = useState<IContributeHistory[]>([]);
  const [pointItems, setPointItems] = useState<IDividendHistory[]>([]);

  const payPagination = useRef<TTabPaginationState>({ ...INITIAL_PAGINATION });
  const pointPagination = useRef<TTabPaginationState>({ ...INITIAL_PAGINATION });

  const getPagination = useCallback(
    (tab: TPayCardHistoryTab) =>
      tab === 'pay' ? payPagination : pointPagination,
    [],
  );

  const fetchTab = useCallback(
    (tab: TPayCardHistoryTab, page: number) => {
      const pagination = getPagination(tab);

      if (tab === 'pay') {
        dispatch(
          getContributeHistoriesRequest({
            balanceAccountType: 'CONTRIBUTION',
            page,
            size: 20,
            onSuccess: (data: ListApiResponse<IContributeHistory[]>) => {
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
    (tab: TPayCardHistoryTab) => {
      setHistoryTab(tab);
      getPagination(tab).current = { ...INITIAL_PAGINATION };
    },
    [getPagination],
  );

  const onPressTranItem = useCallback(
    (item: any) => {
      const isTabContribute = historyTab == 'pay';
      const onSuccess = (detail: IContributeHistoryDetail) => {
        AppNavigator.showDialog({
          data: detail,
          screen: ContributionDetail,
          popupType: 'bottomSheet',
          isContribute: isTabContribute,
          title: isTabContribute
            ? t('pay_card.tab_pay')
            : t('pay_card.tab_point'),
        });
      };
      if (!isTabContribute) {
        dispatch(
          getDividendDetailRequest({ dividendId: Number(item.id), onSuccess }),
        );
      } else {
        dispatch(
          getContributeHistoryDetailRequest({ historyId: item.id, onSuccess }),
        );
      }
    },
    [dispatch, historyTab],
  );

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
