import { HeaderDetail, SegmentedTab } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import { useMemo } from 'react';
import { usePayPointHistories } from '@hooks';
import { useTranslation } from 'react-i18next';
import HistoryList from './HistoryList';
import SummaryHeader from './SummaryHeader';

const SCREEN_BACKGROUND = '#F2F2F2';

function PayPointHistories() {
  const { t } = useTranslation();
  const {
    activeTab,
    currentWallet,
    loading,
    loadingMore,
    onChangeTab,
    onLoadMore,
    onPressWithdrawal,
    onRefresh,
    onPressTransaction,
    payMoneyHistories,
    pointHistories,
    refreshing,
  } = usePayPointHistories();

  const tabs = useMemo(
    () => [
      {
        id: 'payMoney' as const,
        label: t('pay_point.tab_pay_money'),
        render: () => (
          <HistoryList
            histories={payMoneyHistories}
            loading={loading}
            loadingMore={loadingMore}
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
            onPressItem={onPressTransaction}
            refreshing={refreshing}
            type="pay"
          />
        ),
        testID: 'pay-point-tab-pay-money',
      },
      {
        id: 'point' as const,
        label: t('pay_point.tab_point'),
        render: () => (
          <HistoryList
            histories={pointHistories}
            loading={loading}
            loadingMore={loadingMore}
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
            onPressItem={onPressTransaction}
            refreshing={refreshing}
            type="point"
          />
        ),
        testID: 'pay-point-tab-point',
      },
    ],
    [
      t,
      payMoneyHistories,
      pointHistories,
      loading,
      loadingMore,
      onLoadMore,
      onRefresh,
      refreshing,
    ],
  );

  return (
    <View style={styles.container}>
      <HeaderDetail title={t('pay_point.title')} />
      <SummaryHeader
        onPressWithdrawal={onPressWithdrawal}
        summary={currentWallet}
      />
      <SegmentedTab
        activeTab={activeTab}
        onTabChange={onChangeTab}
        style={styles.tabs}
        tabs={tabs}
      />
    </View>
  );
}

export default PayPointHistories;

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
