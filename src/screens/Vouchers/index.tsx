import type { VoucherStatus } from '@type/account';

import { HeaderDetail, SegmentedTab } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVouchers } from '@hooks';
import VoucherList from './VoucherList';
import { VOUCHERS_STATUSES } from '@constants/config';

const SCREEN_BACKGROUND = '#F2F2F2';

function Vouchers() {
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
  } = useVouchers();

  const tabs = useMemo(
    () => [
      {
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
          />
        ),
        testID: 'vouchers-tab-available',
      },
      {
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
          />
        ),
        testID: 'vouchers-tab-used',
      },
      {
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
    ],
  );

  return (
    <View style={styles.container}>
      <HeaderDetail title={t('vouchers.title')} />
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
