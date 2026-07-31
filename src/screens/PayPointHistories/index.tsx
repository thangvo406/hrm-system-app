import { EmptyView, HeaderDetail, SegmentedTab } from '@components';
import { ScaleSize } from '@kits/core';
import imageNames from '@assets/images/names';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useMemo } from 'react';
import { usePayPointHistories } from '@hooks';
import { useTranslation } from 'react-i18next';
import type { TPayPointTab } from '@hooks/usePayPointHistories';
import HistoryCard from './HistoryCard';
// import PointNotice from './PointNotice';
import SummaryHeader from './SummaryHeader';

const SCREEN_BACKGROUND = '#F2F2F2';

function PayPointHistories() {
  const { t } = useTranslation();
  const {
    activeTab,
    // expiringNotice,
    onChangeTab,
    // onDismissNotice,
    onPressWithdrawal,
    payMoneyHistories,
    pointHistories,
    currentWallet,
  } = usePayPointHistories();

  const tabs = useMemo(
    () => [
      {
        id: 'payMoney' as const,
        label: t('pay_point.tab_pay_money'),
        testID: 'pay-point-tab-pay-money',
      },
      {
        id: 'point' as const,
        label: t('pay_point.tab_point'),
        testID: 'pay-point-tab-point',
      },
    ],
    [t],
  );

  const isPointTab = activeTab === 'point';
  const histories = isPointTab ? pointHistories : payMoneyHistories;

  return (
    <View style={styles.safeArea}>
      <HeaderDetail title={t('pay_point.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <SummaryHeader
          onPressWithdrawal={onPressWithdrawal}
          summary={currentWallet}
        />

        <View style={styles.tabBar}>
          <SegmentedTab
            activeTab={activeTab}
            onTabChange={onChangeTab as (tab: TPayPointTab) => void}
            tabs={tabs}
          />
        </View>

        {/* <PointNotice
          amount={expiringNotice.amount}
          days={expiringNotice.days}
          onDismiss={onDismissNotice}
        /> */}

        <View style={styles.list}>
          {histories.length > 0 ? (
            histories.map(item => <HistoryCard item={item} key={item.id} />)
          ) : (
            <EmptyView
              desc={t('pay_point.empty')}
              icon={imageNames.ic_package}
              style={styles.empty}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default PayPointHistories;

const styles = StyleSheet.create({
  empty: {
    paddingVertical: ScaleSize(40),
  },
  list: {
    paddingBottom: ScaleSize(24),
    paddingTop: ScaleSize(6),
  },
  safeArea: {
    backgroundColor: SCREEN_BACKGROUND,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    paddingBottom: ScaleSize(16),
    paddingHorizontal: ScaleSize(16),
  },
});
