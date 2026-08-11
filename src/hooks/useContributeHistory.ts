import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
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
import type {
  IContributeHistoryDetail,
  IContributeSummary,
} from '@type/wallet';
import type {
  IDividendHistory,
  IContributeHistory,
  ListApiResponse,
} from '@type';
import { useCallback, useMemo, useRef, useState } from 'react';
import ContributionDetail from '@dialogs/ContributionDetail';
import { useTranslation } from 'react-i18next';
import { AccountManagementSelector, AppSelector } from '@services/selectors';
import Information from '@dialogs/Information';
import imageNames from '@assets/images/names';
import RequestAddCard from '@dialogs/RequestAddCard';
import DatePicker from '@dialogs/DateRangeFilter';
import dayjs from 'dayjs';

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

const onCapitalWithdrawal = () => {
  AppNavigator.navigate(Paths.CapitalWithdrawal);
}

export const useContributeHistory = () => {
  const [historyTab, setHistoryTab] = useState<TPayCardHistoryTab>('pay');
  const dispatch = useAppDispatch();
  const [summary, setSummary] = useState<IContributeSummary | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const [payItems, setPayItems] = useState<IContributeHistory[]>([]);
  const [pointItems, setPointItems] = useState<IDividendHistory[]>([]);
  const [paramsFilter, setParamsFilter] = useState<any>();
  // Bumped on every reload so re-applying the same range still refetches.
  const [reloadToken, setReloadToken] = useState(0);

  const filterCount = useMemo(() => {
    if (paramsFilter?.fromDate) {
      return 1;
    }
    return 0;
  }, [paramsFilter]);

  const bankAccounts = useAppSelector(
    AccountManagementSelector.getAccountCards,
  );
  const isEnablePaymentCard = useAppSelector(AppSelector.isEnablePaymentCard);

  const requestIdReference = useRef(0);
  const payPagination = useRef<TTabPaginationState>({ ...INITIAL_PAGINATION });
  const pointPagination = useRef<TTabPaginationState>({
    ...INITIAL_PAGINATION,
  });

  const getPagination = useCallback(
    (tab: TPayCardHistoryTab) =>
      tab === 'pay' ? payPagination : pointPagination,
    [],
  );

  const onRecharge = () => {
    if (!isEnablePaymentCard || bankAccounts?.length > 0) {
      AppNavigator.navigate(Paths.ContributionInput);
    } else {
      AppNavigator.showDialog({
        screen: Information,
        iconInfo: {
          name: imageNames.ic_bank_info,
        },
        title: t('home.non_member_dialog.title'),
        desc: t('home.non_member_dialog.desc'),
        cancelTitle: t('home.non_member_dialog.cancel'),
        confirmTitle: t('home.non_member_dialog.confirm'),
        onConfirm: () => {
          AppNavigator.showDialog({
            screen: RequestAddCard,
            isFullScreen: true,
          });
        },
      });
    }
  };

  const fetchTab = useCallback(
    (tab: TPayCardHistoryTab, page: number) => {
      const pagination = getPagination(tab);
      // A request started before a filter change must not be allowed to write
      // its (now wrong) page over the newer one.
      const requestId = requestIdReference.current + 1;
      requestIdReference.current = requestId;
      const isStale = () => requestId !== requestIdReference.current;

      if (tab === 'pay') {
        dispatch(
          getContributeHistoriesRequest({
            balanceAccountType: 'CONTRIBUTION',
            page,
            size: 20,
            ...paramsFilter,
            onSuccess: (data: ListApiResponse<IContributeHistory[]>) => {
              if (isStale()) {
                return;
              }
              pagination.current.isLast = data.last;
              pagination.current.isLoadingMore = false;
              setPayItems(prev =>
                page === 0 ? data.content : [...prev, ...data.content],
              );
              setLoading(false);
              setRefreshing(false);
            },
            onFailure: () => {
              if (isStale()) {
                return;
              }
              pagination.current.isLoadingMore = false;
              setLoading(false);
              setRefreshing(false);
            },
          }),
        );
      } else {
        dispatch(
          getHistoriesDividendRequest({
            page,
            size: 20,
            ...paramsFilter,
            onSuccess: (data: ListApiResponse<IDividendHistory[]>) => {
              if (isStale()) {
                return;
              }
              pagination.current.isLast = data.last;
              pagination.current.isLoadingMore = false;
              setPointItems(prev =>
                page === 0 ? data.content : [...prev, ...data.content],
              );
              setLoading(false);
              setRefreshing(false);
            },
            onFailure: () => {
              if (isStale()) {
                return;
              }
              pagination.current.isLoadingMore = false;
              setLoading(false);
              setRefreshing(false);
            },
          }),
        );
      }
    },
    [dispatch, getPagination, paramsFilter],
  );

  /**
   * Drops both tabs back to page 0 and refetches with `filter`. Every list
   * reload goes through here so the pagination refs can never keep pointing
   * at a page that belonged to the previous filter.
   */
  const reloadWithFilter = useCallback((filter?: any) => {
    payPagination.current = { ...INITIAL_PAGINATION };
    pointPagination.current = { ...INITIAL_PAGINATION };
    setPayItems([]);
    setPointItems([]);
    setParamsFilter(filter);
    setReloadToken(previous => previous + 1);
  }, []);

  const onSubmitFilter = (isReset: boolean) => (_data: any) => {
    if (isReset) {
      reloadWithFilter(undefined);
      return;
    }
    const { from, to } = _data || {};
    reloadWithFilter({
      fromDate: dayjs(`${from}T00:00:00`)?.toISOString(),
      toDate: dayjs(`${to}T23:59:59`)?.toISOString(),
    });
  };

  /** Pull-to-refresh: reload page 0 keeping the filter that is applied. */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getCurrentWalletRequest());
    dispatch(
      getContributeSummaryRequest({
        onSuccess: data => setSummary(data),
        onFailure: () => setSummary(undefined),
      }),
    );
    reloadWithFilter(paramsFilter);
  }, [dispatch, paramsFilter, reloadWithFilter]);
  const onPressFilter = () => {
    AppNavigator.showDialog({
      screen: DatePicker,
      isFullScreen: true,
      maxDate: dayjs().format('YYYY-MM-DD'),
      onSubmit: onSubmitFilter(false),
      onCancel: onSubmitFilter(true),
      // dateSelected: birthdaySelected,
      buttonSubmitTitle: t('date.date_picker.button_submit'),
      buttonCancelTitle: t('date.date_picker.button_reset'),
      popupType: 'bottomSheet',
      dateRange: {
        from: dayjs(),
        // to: birthdaySelected,
      },
      title: t('date.date_picker.range_title'),
    });
  };

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
      // `reloadToken` is what makes a filter apply/reset/refresh refetch even
      // when the range itself is unchanged.
    }, [historyTab, paramsFilter, reloadToken, fetchTab, getPagination]),
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
    onPressFilter,
    onCapitalWithdrawal,
    onRefresh,
    refreshing,
    isEnablePaymentCard,
    filterCount,
    pointTransactions: pointItems,
    summary,
    tranHistories: payItems,
  };
};
