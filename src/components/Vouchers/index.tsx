import type { VoucherStatus } from '@type/account';

import HeaderDetail from '@components/HeaderDetail';
import SegmentedTab from '@components/SegmentedTab';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import VoucherList from './VoucherList';
import { VOUCHERS_STATUSES } from '@constants/config';

const SCREEN_BACKGROUND = '#F2F2F2';

function Vouchers(props: any) {
  const { t } = useTranslation();
  const {
    activeTab,
    availableVouchers,
    expiredVouchers,
    loading,
    loadingMore,
    onChangeTab,
    onLoadMore,
    onRefresh,
    onUseVoucher,
    refreshing,
    usedVouchers,
    expiredLabel,
    btnUseLabel,
    backgroundExpired,
    isHideLabelExpired,
    title,
    isMealTicket
  } = props || {};
  const tabs = useMemo(
    () => [
      {
        icon: 'ic_coupon' as const,
        id: VOUCHERS_STATUSES.AVAILABLE as VoucherStatus,
        label: t('vouchers.tab_available'),
        render: () => (
          <VoucherList
            loading={loading}
            loadingMore={loadingMore}
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
            onUse={onUseVoucher}
            refreshing={refreshing}
            vouchers={availableVouchers}
            expiredLabel={expiredLabel}
            btnUseLabel={btnUseLabel}
            isHideLabelExpired={isHideLabelExpired}
            isMealTicket={isMealTicket}
          />
        ),
        testID: 'vouchers-tab-available',
      },
      {
        icon: 'ic_coupon' as const,
        id: VOUCHERS_STATUSES.USED as VoucherStatus,
        label: t('vouchers.tab_used'),
        render: () => (
          <VoucherList
            loading={loading}
            loadingMore={loadingMore}
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
            onUse={onUseVoucher}
            refreshing={refreshing}
            vouchers={usedVouchers}
            backgroundExpired={backgroundExpired}
            expiredLabel={expiredLabel}
            btnUseLabel={btnUseLabel}
            isExpired
            isMealTicket={isMealTicket}
          />
        ),
        testID: 'vouchers-tab-used',
      },
      {
        icon: 'ic_calendar_x' as const,
        id: VOUCHERS_STATUSES.EXPIRED as VoucherStatus,
        label: t('vouchers.tab_expired'),
        render: () => (
          <VoucherList
            loading={loading}
            loadingMore={loadingMore}
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
            onUse={onUseVoucher}
            refreshing={refreshing}
            vouchers={expiredVouchers}
            isExpired
            backgroundExpired={backgroundExpired}
            expiredLabel={expiredLabel}
            btnUseLabel={btnUseLabel}
            isMealTicket={isMealTicket}
          />
        ),
        testID: 'vouchers-tab-expired',
      },
    ],
    [
      t,
      availableVouchers,
      usedVouchers,
      expiredVouchers,
      loading,
      loadingMore,
      onLoadMore,
      onRefresh,
      onUseVoucher,
      refreshing,
      isMealTicket,
    ],
  );

  return (
    <View style={styles.container}>
      <HeaderDetail title={title || t('vouchers.title')} />
      <SegmentedTab
        activeTab={activeTab}
        onTabChange={onChangeTab}
        style={styles.tabs}
        tabs={tabs}
      />
    </View>
  );
}

export default Vouchers;

const styles = StyleSheet.create({
  container: {
    backgroundColor: SCREEN_BACKGROUND,
    flex: 1,
  },
  tabs: {
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(12),
  },
});
