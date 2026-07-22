import type { IVoucher, VoucherStatus } from '@type/account';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getVouchersRequest } from '@services/slices/account/accountSlice';
import { useAppDispatch } from '@services/common/storeHooks';

const EMPTY_VOUCHERS: Record<VoucherStatus, IVoucher[]> = {
  available: [],
  expired: [],
  used: [],
};

export function useVouchers() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<VoucherStatus>('available');
  const [vouchers, setVouchers] =
    useState<Record<VoucherStatus, IVoucher[]>>(EMPTY_VOUCHERS);
  const [loadedTabs, setLoadedTabs] = useState<ReadonlySet<VoucherStatus>>(
    () => new Set(),
  );
  const [refreshing, setRefreshing] = useState(false);
  const requestedTabs = useRef<Set<VoucherStatus>>(new Set());

  const loadVouchers = useCallback(
    (type: VoucherStatus, force = false) => {
      // Skip if already fetched, unless a refresh forces a reload.
      if (!force && requestedTabs.current.has(type)) {
        return;
      }
      requestedTabs.current.add(type);
      dispatch(
        getVouchersRequest({
          onFailure: () => {
            requestedTabs.current.delete(type);
            setRefreshing(false);
          },
          onSuccess: (data: IVoucher[] = []) => {
            setVouchers(prev => ({ ...prev, [type]: data }));
            setLoadedTabs(prev => new Set(prev).add(type));
            setRefreshing(false);
          },
          type,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    loadVouchers(activeTab);
  }, [activeTab, loadVouchers]);

  const onChangeTab = useCallback((tab: VoucherStatus) => {
    setActiveTab(tab);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadVouchers(activeTab, true);
  }, [activeTab, loadVouchers]);

  const onUseVoucher = useCallback((voucher: IVoucher) => {
    // TODO: navigate to the redeem flow once the endpoint is available.
    console.warn('Redeem voucher not implemented yet:', voucher.id);
  }, []);

  return {
    activeTab,
    availableVouchers: vouchers.available,
    expiredVouchers: vouchers.expired,
    loading: !loadedTabs.has(activeTab),
    onChangeTab,
    onRefresh,
    onUseVoucher,
    refreshing,
    usedVouchers: vouchers.used,
  };
}
