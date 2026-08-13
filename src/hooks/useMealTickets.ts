import type { IMealTicket, IVoucher, VoucherStatus } from '@type/account';
import type { ListApiResponse } from '@type/common';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import {
  generateQRCodeMealTicketRequest,
  generateQRCodeMemberRequest,
  getMealTicketsRequest,
} from '@services/slices/account/accountSlice';
import { useAppDispatch } from '@services/common/storeHooks';
import AppNavigator from '@navigation/AppNavigator';
import QRCodeViewerView from '@components/QRCodeViewerView';
import { VOUCHERS_STATUSES } from '@constants/config';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 20;

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

const EMPTY_VOUCHERS: Record<VoucherStatus, IVoucher[]> = {
  AVAILABLE: [],
  EXPIRED: [],
  USED: [],
};

export function useMealTickets() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<VoucherStatus>(
    VOUCHERS_STATUSES.AVAILABLE,
  );
  const { t } = useTranslation();
  const [vouchers, setVouchers] =
    useState<Record<VoucherStatus, IVoucher[]>>(EMPTY_VOUCHERS);
  const [loadedTabs, setLoadedTabs] = useState<ReadonlySet<VoucherStatus>>(
    () => new Set(),
  );
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const requestedTabs = useRef<Set<VoucherStatus>>(new Set());
  const paginations = useRef<Record<VoucherStatus, TPaginationState>>({
    AVAILABLE: { ...INITIAL_PAGINATION },
    EXPIRED: { ...INITIAL_PAGINATION },
    USED: { ...INITIAL_PAGINATION },
  });

  const fetchVouchers = useCallback(
    (type: VoucherStatus, page: number) => {
      const pagination = paginations.current[type];
      dispatch(
        getMealTicketsRequest({
          onFailure: () => {
            pagination.isLoadingMore = false;
            setRefreshing(false);
            setLoadingMore(false);
          },
          onSuccess: (data: ListApiResponse<IVoucher[]>) => {
            const content = data.content ?? [];
            pagination.isLast = data.last;
            pagination.isLoadingMore = false;
            pagination.loaded = true;
            pagination.page = page;
            setVouchers(prev => ({
              ...prev,
              [type]: page === 0 ? content : [...prev[type], ...content],
            }));
            setLoadedTabs(prev => new Set(prev).add(type));
            setRefreshing(false);
            setLoadingMore(false);
          },
          page,
          size: PAGE_SIZE,
          status: type,
        }),
      );
    },
    [dispatch],
  );

  const loadVouchers = useCallback(
    (type: VoucherStatus, force = false) => {
      // Skip if already fetched, unless a refresh forces a reload.
      if (!force && requestedTabs.current.has(type)) {
        return;
      }
      requestedTabs.current.add(type);
      paginations.current[type] = { ...INITIAL_PAGINATION };
      fetchVouchers(type, 0);
    },
    [fetchVouchers],
  );

  useEffect(() => {
    loadVouchers(activeTab);
  }, [activeTab, loadVouchers]);

  const isFirstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }

      requestedTabs.current.clear();
      loadVouchers(activeTab, true);
    }, [activeTab, loadVouchers]),
  );

  const onChangeTab = useCallback((tab: VoucherStatus) => {
    setLoadingMore(false);
    setActiveTab(tab);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadVouchers(activeTab, true);
  }, [activeTab, loadVouchers]);

  const onLoadMore = useCallback(() => {
    const pagination = paginations.current[activeTab];
    if (!pagination.loaded || pagination.isLast || pagination.isLoadingMore) {
      return;
    }
    pagination.isLoadingMore = true;
    setLoadingMore(true);
    fetchVouchers(activeTab, pagination.page + 1);
  }, [activeTab, fetchVouchers]);

  const onRefreshQR = (voucher: any) => (callback: any) => {
    dispatch(
      generateQRCodeMemberRequest({
        cpn: [voucher.code],
        onSuccess: response => {
          callback(response);
        },
      }),
    );
  };

  const onUseVoucher = useCallback((voucher: IMealTicket) => {
    dispatch(
      generateQRCodeMealTicketRequest({
        ticketCode: voucher.code,
        onSuccess: response => {
          AppNavigator.showDialog({
            screen: QRCodeViewerView,
            isFullScreen: true,
            showBtnVoucher: true,
            showIconVoucher: false,
            titleKey: 'meal_ticket.detail.title',
            btnVoucher: `‹${t('meal_ticket.detail.btn_back')}`,
            titleVoucher: voucher?.productName,
            data: response,
            onRefresh: onRefreshQR(voucher),
          });
        },
      }),
    );
  }, []);

  return {
    activeTab,
    availableVouchers: vouchers.AVAILABLE,
    expiredVouchers: vouchers.EXPIRED,
    loading: !loadedTabs.has(activeTab),
    loadingMore,
    onChangeTab,
    onLoadMore,
    onRefresh,
    onUseVoucher,
    refreshing,
    usedVouchers: vouchers.USED,
  };
}
